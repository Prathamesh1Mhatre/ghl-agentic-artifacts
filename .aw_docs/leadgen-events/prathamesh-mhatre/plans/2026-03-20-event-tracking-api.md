---
namespace: leadgen-events
author: prathamesh-mhatre
type: plan
title: Event Tracking API Implementation
date: 2026-03-20
status: in-progress
confidence: high
tags:
  - api
  - backend
  - tracking
  - nestjs
---

# Event Tracking API Implementation Plan

## Overview

Implement REST API endpoints for event tracking, retrieval, and analytics. Built with NestJS following GHL platform patterns.

## Endpoints

### POST /api/v1/events
**Purpose**: Track new events
**Auth**: API key or OAuth token
**Rate Limit**: 1000 req/min per client

**Request Body**:
```json
{
  "eventType": "page_view",
  "timestamp": "2026-03-20T10:30:00Z",
  "userId": "user_123",
  "sessionId": "session_456",
  "properties": {
    "page": "/landing/product-a",
    "referrer": "google.com",
    "utm_source": "email"
  }
}
```

### GET /api/v1/events
**Purpose**: Retrieve events with filtering
**Auth**: OAuth token
**Pagination**: Cursor-based

**Query Parameters**:
- `eventType`: Filter by event type
- `userId`: Filter by user
- `startDate`, `endDate`: Date range
- `limit`: Max results (default 100, max 1000)
- `cursor`: Pagination token

### GET /api/v1/analytics/metrics
**Purpose**: Aggregated metrics
**Auth**: OAuth token
**Cache**: 5 minutes

**Metrics**:
- Total events (by type)
- Unique users
- Conversion rates
- Geographic distribution

## Architecture

### Tech Stack
- NestJS framework
- MongoDB for event storage
- Redis for caching
- ClickHouse for analytics queries

### Modules
1. **EventsModule**: Core event tracking
2. **AnalyticsModule**: Aggregations and metrics
3. **ValidationModule**: Schema validation
4. **AuthModule**: API key and OAuth handling

## Data Model

### Event Document (MongoDB)
```typescript
interface Event {
  _id: ObjectId;
  eventType: string;
  timestamp: Date;
  userId: string;
  sessionId: string;
  properties: Record<string, any>;
  metadata: {
    ip: string;
    userAgent: string;
    location: GeoLocation;
  };
  createdAt: Date;
}
```

### Analytics Materialized View (ClickHouse)
- Hourly aggregations
- Daily rollups
- Event type counts
- User engagement metrics

## Implementation Phases

### Phase 1: Core Event Ingestion (Week 1)
- [ ] POST /api/v1/events endpoint
- [ ] Event validation schemas
- [ ] MongoDB storage
- [ ] Unit tests

### Phase 2: Event Retrieval (Week 2)
- [ ] GET /api/v1/events endpoint
- [ ] Filtering and pagination
- [ ] Indexing optimization
- [ ] Integration tests

### Phase 3: Analytics (Week 3)
- [ ] ClickHouse integration
- [ ] Aggregation queries
- [ ] GET /api/v1/analytics/metrics endpoint
- [ ] Caching layer

### Phase 4: Performance & Monitoring (Week 4)
- [ ] Load testing (k6)
- [ ] APM integration
- [ ] Alert rules
- [ ] Documentation

## Quality Gates

- ✅ OpenAPI spec validation
- ✅ 80%+ test coverage
- ✅ <200ms P95 latency
- ✅ Multi-tenant isolation verified
- ✅ Security review passed

## Dependencies

- Platform base-service v2.1+
- MongoDB 6.0+
- Redis 7.0+
- ClickHouse 23.0+

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| High event volume | Performance degradation | Implement rate limiting and queueing |
| Schema evolution | Breaking changes | Versioned API, backward compatibility |
| Data retention | Storage costs | Implement TTL policies, archival strategy |
