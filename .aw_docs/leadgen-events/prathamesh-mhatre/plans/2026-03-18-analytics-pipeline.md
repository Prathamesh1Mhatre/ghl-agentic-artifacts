---
namespace: leadgen-events
author: prathamesh-mhatre
type: plan
title: Real-time Analytics Pipeline
date: 2026-03-18
status: planning
confidence: medium
tags:
  - analytics
  - pipeline
  - clickhouse
  - streaming
---

# Real-time Analytics Pipeline Implementation Plan

## Overview

Build a streaming analytics pipeline for processing leadgen events in near real-time. Events flow from MongoDB change streams to ClickHouse for fast analytical queries.

## Architecture

```
MongoDB → Change Stream → Worker → ClickHouse → Grafana
                ↓
             Redis Cache
```

## Components

### 1. Change Stream Worker (NestJS)
**Purpose**: Capture MongoDB changes and forward to ClickHouse

**Features**:
- MongoDB change stream subscription
- Event transformation
- Batch processing (100 events or 5s window)
- Retry with exponential backoff
- Dead letter queue for failures

**Technology**:
- NestJS worker (base-worker)
- Bull queue for buffering
- Redis for coordination

### 2. ClickHouse Schema
**Purpose**: Store analytical data for fast queries

**Tables**:

**events_raw** (Raw events table)
```sql
CREATE TABLE events_raw (
  event_id String,
  event_type LowCardinality(String),
  timestamp DateTime64(3),
  user_id String,
  session_id String,
  properties String,
  date Date MATERIALIZED toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (event_type, timestamp);
```

**events_hourly** (Aggregated metrics)
```sql
CREATE MATERIALIZED VIEW events_hourly
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, hour, event_type)
AS SELECT
  toDate(timestamp) as date,
  toHour(timestamp) as hour,
  event_type,
  count() as event_count,
  uniq(user_id) as unique_users
FROM events_raw
GROUP BY date, hour, event_type;
```

### 3. Query Service
**Purpose**: Expose analytics via REST API

**Endpoints**:
- GET /analytics/events/count
- GET /analytics/users/active
- GET /analytics/funnels/:funnelId
- GET /analytics/retention

**Caching Strategy**:
- Redis cache with 5-minute TTL
- Cache invalidation on new data batches
- Stale-while-revalidate pattern

## Data Flow

1. **Event Ingestion**
   - Client sends event to POST /api/v1/events
   - Validated and stored in MongoDB
   - MongoDB change stream emits change event

2. **Stream Processing**
   - Worker receives change event
   - Transforms to ClickHouse format
   - Buffers in memory (100 events or 5s)
   - Bulk insert to ClickHouse

3. **Query Processing**
   - Client requests analytics
   - Check Redis cache
   - If miss, query ClickHouse
   - Cache result in Redis
   - Return to client

## Implementation Phases

### Phase 1: Worker Setup (Week 1)
- [ ] Create leadgen-events-analytics-worker
- [ ] MongoDB change stream integration
- [ ] Event transformation logic
- [ ] Unit tests

### Phase 2: ClickHouse Integration (Week 2)
- [ ] Table schemas
- [ ] Materialized views
- [ ] Bulk insert implementation
- [ ] Connection pooling

### Phase 3: Query Service (Week 3)
- [ ] Analytics endpoints
- [ ] Query optimization
- [ ] Redis caching
- [ ] Integration tests

### Phase 4: Monitoring & Optimization (Week 4)
- [ ] Grafana dashboards
- [ ] Alert rules
- [ ] Performance tuning
- [ ] Load testing

## Performance Targets

| Metric | Target |
|--------|--------|
| Ingestion latency | <5s (P95) |
| Query latency | <200ms (P95) |
| Throughput | 10,000 events/sec |
| Data freshness | <10s |

## Quality Gates

- ✅ E2E data flow tested
- ✅ Worker crash recovery verified
- ✅ Query performance benchmarked
- ✅ Monitoring dashboards deployed
- ✅ Runbook documented

## Dependencies

- MongoDB with change streams enabled
- ClickHouse 23.0+ cluster
- Redis 7.0+ for caching
- NestJS base-worker v2.0+

## Risks

| Risk | Mitigation |
|------|------------|
| Worker lag during high load | Horizontal scaling, queue backpressure |
| ClickHouse storage growth | Partition pruning, TTL policies |
| Cache stampede | Stale-while-revalidate pattern |
| Change stream cursor loss | Periodic checkpoint persistence |
