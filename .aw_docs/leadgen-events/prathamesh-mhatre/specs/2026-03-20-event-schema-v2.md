---
namespace: leadgen-events
author: prathamesh-mhatre
type: spec
title: Event Schema V2 Specification
date: 2026-03-20
status: draft
confidence: high
tags:
  - event-schema
  - specification
  - api
  - versioning
---

# Event Schema V2 Specification

## Status: DRAFT

**Version**: 2.0.0
**Date**: 2026-03-20
**Author**: prathamesh-mhatre

## Overview

This document specifies the Event Schema V2 for the leadgen events platform. V2 introduces breaking changes from V1 to improve queryability, reduce storage overhead, and align with industry standards.

## Migration from V1

**Timeline**: Q2 2026
**Support Period**: V1 deprecated 2026-06-01, end-of-life 2026-12-01

## Core Schema

### Event Structure

```typescript
interface EventV2 {
  // Required fields
  id: string;                    // Format: evt_{16 alphanumeric}
  type: EventType;               // See Event Types section
  timestamp: string;             // ISO 8601 format
  session_id: string;            // Format: session_{16 alphanumeric}
  version: string;               // Semantic version (e.g., "2.0.0")

  // User identification (at least one required)
  user_id?: string;              // Authenticated user
  anonymous_id?: string;         // Anonymous visitor

  // Event data
  properties: EventProperties;   // Type-specific properties

  // Context
  context: EventContext;         // See Context section

  // Metadata
  received_at?: string;          // Server timestamp (set by backend)
  source: EventSource;           // Event origin
}

enum EventSource {
  WEB = 'web',
  MOBILE_IOS = 'mobile_ios',
  MOBILE_ANDROID = 'mobile_android',
  API = 'api',
  BACKEND = 'backend'
}
```

### Event Types

```typescript
enum EventType {
  // Page tracking
  PAGE_VIEW = 'page_view',
  PAGE_EXIT = 'page_exit',

  // User interactions
  BUTTON_CLICK = 'button_click',
  LINK_CLICK = 'link_click',
  FORM_START = 'form_start',
  FORM_SUBMIT = 'form_submit',
  FORM_ABANDON = 'form_abandon',

  // E-commerce
  PRODUCT_VIEW = 'product_view',
  ADD_TO_CART = 'add_to_cart',
  CHECKOUT_START = 'checkout_start',
  PURCHASE = 'purchase',

  // Custom
  CUSTOM = 'custom'
}
```

### Event Properties

**Type-specific properties** - each event type has required and optional properties:

#### page_view
```typescript
interface PageViewProperties {
  page_path: string;             // Required - URL path
  page_title: string;            // Required - Page title
  page_url?: string;             // Full URL (optional)
  referrer?: string;             // Referrer URL
  search?: string;               // Search query params
}
```

#### form_submit
```typescript
interface FormSubmitProperties {
  form_id: string;               // Required - Form identifier
  form_name: string;             // Required - Form name
  field_count: number;           // Required - Number of fields
  completion_time_ms: number;    // Required - Time to complete
  fields?: string[];             // Field names (PII-safe)
  validation_errors?: number;    // Number of validation errors
}
```

#### button_click
```typescript
interface ButtonClickProperties {
  button_id?: string;            // Button identifier
  button_text: string;           // Required - Button text
  button_location: string;       // Required - Page location
  target_url?: string;           // Link destination
}
```

### Event Context

```typescript
interface EventContext {
  // Device
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    os: string;                  // e.g., "macOS", "Windows", "iOS"
    os_version?: string;
    browser: string;             // e.g., "Chrome", "Safari"
    browser_version?: string;
    screen_width: number;
    screen_height: number;
  };

  // Network
  network: {
    ip: string;                  // IPv4 or IPv6
    user_agent: string;          // Full user agent string
  };

  // Location (optional)
  location?: {
    country: string;             // ISO 3166-1 alpha-2
    region?: string;             // State/province
    city?: string;
  };

  // Page context (for web events)
  page?: {
    url: string;
    path: string;
    title: string;
    referrer?: string;
  };

  // Campaign tracking (optional)
  campaign?: {
    source?: string;             // utm_source
    medium?: string;             // utm_medium
    name?: string;               // utm_campaign
    term?: string;               // utm_term
    content?: string;            // utm_content
  };
}
```

## Validation Rules

### Field Constraints

| Field | Type | Min | Max | Pattern | Required |
|-------|------|-----|-----|---------|----------|
| `id` | string | 20 | 20 | `^evt_[a-zA-Z0-9]{16}$` | ✅ |
| `type` | enum | - | - | EventType values | ✅ |
| `timestamp` | string | - | - | ISO 8601 | ✅ |
| `session_id` | string | 24 | 24 | `^session_[a-zA-Z0-9]{16}$` | ✅ |
| `user_id` | string | 21 | 21 | `^user_[a-zA-Z0-9]{16}$` | 🔵 |
| `anonymous_id` | string | 25 | 25 | `^anon_[a-zA-Z0-9]{20}$` | 🔵 |
| `version` | string | 5 | 10 | `^\d+\.\d+\.\d+$` | ✅ |

🔵 = At least one of `user_id` or `anonymous_id` required

### JSON Schema

Full JSON Schema available at: `/schemas/event-v2.0.0.json`

## Example Events

### Complete Page View Event

```json
{
  "id": "evt_a1b2c3d4e5f6g7h8",
  "type": "page_view",
  "timestamp": "2026-03-20T10:30:45.123Z",
  "session_id": "session_x1y2z3a4b5c6",
  "version": "2.0.0",
  "user_id": "user_9m8n7b6v5c4x",
  "properties": {
    "page_path": "/landing/premium-plan",
    "page_title": "Premium Plan - GoHighLevel",
    "page_url": "https://app.gohighlevel.com/landing/premium-plan",
    "referrer": "https://google.com/search?q=crm"
  },
  "context": {
    "device": {
      "type": "desktop",
      "os": "macOS",
      "os_version": "14.2",
      "browser": "Chrome",
      "browser_version": "120.0",
      "screen_width": 1920,
      "screen_height": 1080
    },
    "network": {
      "ip": "192.168.1.100",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
    },
    "location": {
      "country": "US",
      "region": "CA",
      "city": "San Francisco"
    },
    "campaign": {
      "source": "google",
      "medium": "cpc",
      "name": "premium_q1_2026"
    }
  },
  "source": "web",
  "received_at": "2026-03-20T10:30:45.456Z"
}
```

### Minimal Form Submit Event

```json
{
  "id": "evt_b2c3d4e5f6g7h8i9",
  "type": "form_submit",
  "timestamp": "2026-03-20T10:35:00.000Z",
  "session_id": "session_x1y2z3a4b5c6",
  "version": "2.0.0",
  "anonymous_id": "anon_p9o8i7u6y5t4r3e2w1",
  "properties": {
    "form_id": "contact_us_main",
    "form_name": "Contact Us",
    "field_count": 4,
    "completion_time_ms": 67000
  },
  "context": {
    "device": {
      "type": "mobile",
      "os": "iOS",
      "browser": "Safari",
      "screen_width": 375,
      "screen_height": 667
    },
    "network": {
      "ip": "203.0.113.45",
      "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0..."
    }
  },
  "source": "web"
}
```

## Breaking Changes from V1

### Renamed Fields

| V1 Field | V2 Field | Notes |
|----------|----------|-------|
| `eventType` | `type` | Shorter, SQL-friendly |
| `userId` | `user_id` | Snake case for ClickHouse |
| `sessionId` | `session_id` | Snake case |
| `anonymousId` | `anonymous_id` | Snake case |
| `receivedAt` | `received_at` | Snake case |

### Removed Fields

| Field | Reason | Migration |
|-------|--------|-----------|
| `traits` | Redundant with `context` | Move to `context.user` |
| `messageId` | Duplicate of `id` | Use `id` |
| `sentAt` | Not used | Remove |

### New Fields

| Field | Description | Default |
|-------|-------------|---------|
| `version` | Schema version | Required |
| `source` | Event source | Required |
| `context.device.type` | Device category | Required |

## Implementation Guidelines

### Client-Side (JavaScript)

```javascript
// Event tracking function
function trackEvent(type, properties) {
  const event = {
    id: generateEventId(),
    type,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    version: '2.0.0',
    user_id: getUserId(),
    anonymous_id: getAnonymousId(),
    properties,
    context: {
      device: getDeviceContext(),
      network: getNetworkContext(),
      page: getPageContext(),
      campaign: getCampaignContext()
    },
    source: 'web'
  };

  // Send to backend
  await fetch('/api/v1/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}

// Usage
trackEvent('page_view', {
  page_path: window.location.pathname,
  page_title: document.title,
  page_url: window.location.href,
  referrer: document.referrer
});
```

### Server-Side (NestJS)

```typescript
// DTO validation
import { IsString, IsEnum, IsNotEmpty, Matches } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Matches(/^evt_[a-zA-Z0-9]{16}$/)
  id: string;

  @IsEnum(EventType)
  type: EventType;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  @Matches(/^session_[a-zA-Z0-9]{16}$/)
  session_id: string;

  @IsString()
  @Matches(/^\d+\.\d+\.\d+$/)
  version: string;

  // ... other fields
}

// Service
async createEvent(dto: CreateEventDto) {
  // Validate schema version
  if (!this.isSupportedVersion(dto.version)) {
    throw new BadRequestException('Unsupported schema version');
  }

  // Add server timestamp
  const event = {
    ...dto,
    received_at: new Date().toISOString()
  };

  // Save to MongoDB
  await this.eventsRepository.create(event);

  return event;
}
```

## References

- [Segment Spec](https://segment.com/docs/connections/spec/)
- [CloudEvents Spec](https://cloudevents.io/)
- [JSON Schema](https://json-schema.org/)
- [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)

## Changelog

### 2.0.0 (2026-03-20)
- BREAKING: Renamed fields to snake_case
- BREAKING: Removed `traits`, `messageId`, `sentAt`
- BREAKING: Made `version` and `source` required
- Added: `context.device.type` field
- Added: Strict validation patterns

## Approval

- [ ] Product Manager
- [ ] Tech Lead
- [ ] Backend Engineer
- [ ] Frontend Engineer
- [ ] QA Lead
