---
namespace: leadgen-events
author: prathamesh-mhatre
type: spec
title: Tracking API Specification
date: 2026-03-18
status: approved
confidence: high
tags:
  - api
  - specification
  - openapi
  - rest
---

# Tracking API Specification

## Status: APPROVED

**Version**: 1.0.0
**Date**: 2026-03-18
**Author**: prathamesh-mhatre

## Overview

RESTful API for event tracking, retrieval, and analytics. Follows GHL platform standards for authentication, rate limiting, and multi-tenancy.

## Base URL

- **Production**: `https://services.leadconnectorhq.com/events/v1`
- **Staging**: `https://staging.leadconnectorhq.com/events/v1`

## Authentication

All endpoints require authentication via:

### API Key (Recommended for server-side)
```http
Authorization: Bearer sk_live_abc123...
```

### OAuth 2.0 Token
```http
Authorization: Bearer oauth_token_xyz...
```

## Endpoints

### 1. Track Event

**POST** `/events`

Track a new event.

#### Request Headers
```http
Content-Type: application/json
Authorization: Bearer {token}
X-Location-Id: {locationId}
```

#### Request Body
```json
{
  "id": "evt_a1b2c3d4e5f6g7h8",
  "type": "page_view",
  "timestamp": "2026-03-18T10:30:00Z",
  "session_id": "session_x1y2z3a4b5c6",
  "user_id": "user_9m8n7b6v5c4x",
  "version": "2.0.0",
  "properties": {
    "page_path": "/landing/premium",
    "page_title": "Premium Plan"
  },
  "context": {
    "device": {
      "type": "desktop",
      "os": "macOS",
      "browser": "Chrome",
      "screen_width": 1920,
      "screen_height": 1080
    },
    "network": {
      "ip": "192.168.1.100",
      "user_agent": "Mozilla/5.0..."
    }
  },
  "source": "web"
}
```

#### Response (201 Created)
```json
{
  "id": "evt_a1b2c3d4e5f6g7h8",
  "status": "received",
  "received_at": "2026-03-18T10:30:00.123Z"
}
```

#### Error Responses

**400 Bad Request** - Validation error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid event schema",
    "details": [
      {
        "field": "timestamp",
        "error": "Must be ISO 8601 format"
      }
    ]
  }
}
```

**401 Unauthorized** - Invalid token
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**429 Too Many Requests** - Rate limit exceeded
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retry_after": 60
  }
}
```

#### Rate Limits
- **Default**: 1,000 requests per minute per location
- **Burst**: Up to 2,000 requests per minute
- **Response Headers**:
  ```http
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 847
  X-RateLimit-Reset: 1710758400
  ```

---

### 2. List Events

**GET** `/events`

Retrieve events with filtering and pagination.

#### Query Parameters

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `event_type` | string | No | Filter by event type | - |
| `user_id` | string | No | Filter by user ID | - |
| `session_id` | string | No | Filter by session ID | - |
| `start_date` | string | No | Start date (ISO 8601) | 7 days ago |
| `end_date` | string | No | End date (ISO 8601) | now |
| `limit` | integer | No | Max results (1-1000) | 100 |
| `cursor` | string | No | Pagination cursor | - |

#### Request
```http
GET /events?event_type=page_view&limit=50&start_date=2026-03-01T00:00:00Z
Authorization: Bearer {token}
X-Location-Id: {locationId}
```

#### Response (200 OK)
```json
{
  "data": [
    {
      "id": "evt_a1b2c3d4e5f6g7h8",
      "type": "page_view",
      "timestamp": "2026-03-18T10:30:00Z",
      "user_id": "user_9m8n7b6v5c4x",
      "properties": {
        "page_path": "/landing/premium"
      }
    },
    // ... more events
  ],
  "pagination": {
    "next_cursor": "cursor_xyz123",
    "has_more": true,
    "total_count": 1547
  }
}
```

---

### 3. Get Event

**GET** `/events/{eventId}`

Retrieve a single event by ID.

#### Request
```http
GET /events/evt_a1b2c3d4e5f6g7h8
Authorization: Bearer {token}
X-Location-Id: {locationId}
```

#### Response (200 OK)
```json
{
  "id": "evt_a1b2c3d4e5f6g7h8",
  "type": "page_view",
  "timestamp": "2026-03-18T10:30:00Z",
  "session_id": "session_x1y2z3a4b5c6",
  "user_id": "user_9m8n7b6v5c4x",
  "version": "2.0.0",
  "properties": {
    "page_path": "/landing/premium",
    "page_title": "Premium Plan"
  },
  "context": {
    "device": {
      "type": "desktop",
      "os": "macOS",
      "browser": "Chrome"
    }
  },
  "source": "web",
  "received_at": "2026-03-18T10:30:00.123Z"
}
```

#### Error Responses

**404 Not Found**
```json
{
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found"
  }
}
```

---

### 4. Get Analytics Metrics

**GET** `/analytics/metrics`

Get aggregated metrics for events.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `metric` | string | Yes | Metric type (see below) |
| `start_date` | string | No | Start date (ISO 8601) |
| `end_date` | string | No | End date (ISO 8601) |
| `group_by` | string | No | Group by dimension |
| `event_type` | string | No | Filter by event type |

#### Metric Types

- `event_count` - Total event count
- `unique_users` - Unique user count
- `unique_sessions` - Unique session count
- `avg_session_duration` - Average session duration
- `conversion_rate` - Conversion rate (requires funnel config)

#### Request
```http
GET /analytics/metrics?metric=event_count&group_by=event_type&start_date=2026-03-01T00:00:00Z
Authorization: Bearer {token}
X-Location-Id: {locationId}
```

#### Response (200 OK)
```json
{
  "metric": "event_count",
  "period": {
    "start": "2026-03-01T00:00:00Z",
    "end": "2026-03-18T23:59:59Z"
  },
  "data": [
    {
      "dimension": "page_view",
      "value": 15742
    },
    {
      "dimension": "form_submit",
      "value": 3421
    },
    {
      "dimension": "button_click",
      "value": 8934
    }
  ],
  "total": 28097
}
```

---

### 5. Batch Track Events

**POST** `/events/batch`

Track multiple events in a single request.

#### Request Body
```json
{
  "batch": [
    {
      "id": "evt_a1b2c3d4e5f6g7h8",
      "type": "page_view",
      "timestamp": "2026-03-18T10:30:00Z",
      // ... full event object
    },
    {
      "id": "evt_b2c3d4e5f6g7h8i9",
      "type": "button_click",
      "timestamp": "2026-03-18T10:30:05Z",
      // ... full event object
    }
  ]
}
```

#### Response (207 Multi-Status)
```json
{
  "results": [
    {
      "id": "evt_a1b2c3d4e5f6g7h8",
      "status": "accepted",
      "received_at": "2026-03-18T10:30:00.123Z"
    },
    {
      "id": "evt_b2c3d4e5f6g7h8i9",
      "status": "rejected",
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid timestamp format"
      }
    }
  ],
  "summary": {
    "total": 2,
    "accepted": 1,
    "rejected": 1
  }
}
```

#### Limits
- Max batch size: 100 events
- Total request size: 1 MB

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `EVENT_NOT_FOUND` | 404 | Event not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## Multi-Tenancy

All requests must include `X-Location-Id` header for tenant isolation.

Events are automatically scoped to:
- **Company ID** (from auth token)
- **Location ID** (from header)

Cross-location queries are not permitted.

## Pagination

Cursor-based pagination for consistent results:

```http
GET /events?limit=100&cursor=cursor_xyz123
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "cursor_abc456",
    "has_more": true
  }
}
```

## Caching

Analytics endpoints are cached:
- **TTL**: 5 minutes
- **Cache-Control**: `public, max-age=300`
- **ETag**: Supported for conditional requests

## Webhooks (Future)

**Status**: Planned for v1.1

Will support real-time event notifications via webhooks.

## SDK Support

**Official SDKs**:
- JavaScript/TypeScript - `@gohighlevel/events-sdk`
- Python - `gohighlevel-events`

**Community SDKs**:
- Ruby - `ghl-events-ruby`
- PHP - `ghl-events-php`

## OpenAPI Specification

Full OpenAPI 3.0 spec available at:
`https://services.leadconnectorhq.com/events/openapi.json`

## Change Log

### 1.0.0 (2026-03-18)
- Initial release
- POST /events - Track single event
- GET /events - List events
- GET /events/{id} - Get event
- GET /analytics/metrics - Get metrics
- POST /events/batch - Batch tracking

## Approval

- [x] Product Manager - Sarah Chen
- [x] Tech Lead - Michael Torres
- [x] Backend Engineer - prathamesh-mhatre
- [x] QA Lead - Emily Watson
- [x] Security Review - James Park
