---
namespace: leadgen-events
author: prathamesh-mhatre
type: research
title: Event Schema Design Patterns
date: 2026-03-17
status: complete
confidence: high
tags:
  - event-schema
  - data-modeling
  - best-practices
---

# Event Schema Design Patterns Research

## Research Question

What event schema design patterns should we adopt for the leadgen events platform to ensure:
1. Flexibility for evolving requirements
2. Queryability for analytics
3. Validation and type safety
4. Backward compatibility

## Industry Best Practices

### 1. Segment's Event Schema Pattern

**Structure**:
```json
{
  "anonymousId": "user_anon_123",
  "userId": "user_123",
  "type": "track",
  "event": "Product Viewed",
  "properties": {
    "product_id": "prod_456",
    "name": "Premium Plan",
    "price": 99.00
  },
  "timestamp": "2026-03-17T10:30:00Z",
  "context": {
    "ip": "192.168.1.1",
    "userAgent": "...",
    "page": {...},
    "campaign": {...}
  }
}
```

**Pros**:
- ✅ Well-documented standard
- ✅ Strong ecosystem support
- ✅ Clear separation: properties vs context

**Cons**:
- ❌ Nested objects reduce queryability
- ❌ Context bloat for simple events

### 2. CloudEvents Specification (CNCF)

**Structure**:
```json
{
  "specversion": "1.0",
  "type": "com.example.leadgen.page_view",
  "source": "https://app.gohighlevel.com",
  "id": "evt_123",
  "time": "2026-03-17T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "page": "/landing/product-a",
    "userId": "user_123"
  }
}
```

**Pros**:
- ✅ CNCF standard (widely adopted)
- ✅ Designed for distributed systems
- ✅ Clear versioning strategy

**Cons**:
- ❌ Verbose for simple use cases
- ❌ More suited for event-driven architecture

### 3. Snowplow Event Model

**Structure**:
```json
{
  "schema": "iglu:com.snowplowanalytics/track/jsonschema/1-0-0",
  "data": {
    "e": "pv",
    "tv": "js-2.14.0",
    "p": "web",
    "uid": "user_123",
    "url": "https://...",
    "ue_pr": "{...}"
  }
}
```

**Pros**:
- ✅ Schema registry integration
- ✅ Compact representation
- ✅ Built for high-volume tracking

**Cons**:
- ❌ Cryptic field names (e, tv, p)
- ❌ Requires schema registry

## Recommended Schema Design

**Hybrid approach** - combine best practices from Segment and CloudEvents:

```typescript
interface Event {
  // Core identification
  id: string;                    // Unique event ID
  type: string;                  // Event type (e.g., "page_view")
  timestamp: string;             // ISO 8601 timestamp

  // User identification
  userId?: string;               // Authenticated user ID
  anonymousId?: string;          // Anonymous visitor ID
  sessionId: string;             // Session identifier

  // Event data (flattened for queryability)
  properties: Record<string, any>;

  // Context (separate from properties)
  context: {
    ip: string;
    userAgent: string;
    page?: {
      url: string;
      path: string;
      title: string;
      referrer?: string;
    };
    campaign?: {
      source?: string;
      medium?: string;
      name?: string;
      term?: string;
      content?: string;
    };
    location?: {
      country: string;
      region?: string;
      city?: string;
    };
  };

  // Metadata
  version: string;               // Schema version
  source: string;                // Event source (e.g., "web", "mobile", "api")
}
```

## Schema Evolution Strategy

### Versioning Approach

1. **Major version** (v2.0.0): Breaking changes
   - Remove fields
   - Change field types
   - Rename fields

2. **Minor version** (v1.1.0): Backward-compatible additions
   - Add new fields
   - Add new event types
   - Extend enums

3. **Patch version** (v1.0.1): Clarifications
   - Documentation updates
   - Validation rules

### Backward Compatibility Rules

✅ **Safe Changes**:
- Adding optional fields
- Adding new event types
- Making required fields optional
- Widening validation constraints

❌ **Breaking Changes**:
- Removing fields
- Renaming fields
- Changing field types
- Making optional fields required
- Narrowing validation constraints

### Migration Strategy

**Multi-version support** for 6 months:
```typescript
// Accept both v1 and v2 schemas
if (event.version === '1.0.0') {
  // Transform to v2
  return migrateV1ToV2(event);
}
return event;
```

## Validation with JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LeadGen Event",
  "type": "object",
  "required": ["id", "type", "timestamp", "sessionId", "version"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^evt_[a-zA-Z0-9]{16}$"
    },
    "type": {
      "type": "string",
      "enum": ["page_view", "form_submit", "button_click", "custom"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "userId": {
      "type": "string",
      "pattern": "^user_[a-zA-Z0-9]{16}$"
    },
    "properties": {
      "type": "object"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    }
  }
}
```

## Performance Considerations

### Flattened Properties for Analytics

❌ **Avoid deep nesting**:
```json
{
  "properties": {
    "product": {
      "details": {
        "pricing": {
          "amount": 99.00
        }
      }
    }
  }
}
```

✅ **Prefer flattened structure**:
```json
{
  "properties": {
    "product_id": "prod_456",
    "product_name": "Premium Plan",
    "product_price": 99.00
  }
}
```

**Rationale**: ClickHouse handles flat structures better for queries.

### Field Naming Conventions

✅ **Use snake_case** (not camelCase):
```json
{
  "user_id": "user_123",          // ✅ Good
  "userId": "user_123"            // ❌ Avoid
}
```

**Rationale**: SQL compatibility, ClickHouse column naming.

## Recommendations

1. ✅ **Adopt hybrid schema** (Segment + CloudEvents patterns)
2. ✅ **Use JSON Schema for validation**
3. ✅ **Implement semantic versioning**
4. ✅ **Flatten properties for analytics**
5. ✅ **Use snake_case naming**
6. ✅ **Support multi-version for 6 months**
7. ✅ **Document migration guides**

## Example Event Types

### Page View
```json
{
  "id": "evt_abc123",
  "type": "page_view",
  "timestamp": "2026-03-17T10:30:00Z",
  "sessionId": "session_xyz",
  "properties": {
    "page_path": "/landing/product-a",
    "page_title": "Premium Plans",
    "referrer": "https://google.com"
  },
  "version": "1.0.0"
}
```

### Form Submit
```json
{
  "id": "evt_def456",
  "type": "form_submit",
  "timestamp": "2026-03-17T10:35:00Z",
  "userId": "user_123",
  "sessionId": "session_xyz",
  "properties": {
    "form_id": "contact_form",
    "form_name": "Contact Us",
    "field_count": 5,
    "completion_time_ms": 45000
  },
  "version": "1.0.0"
}
```

## Next Steps

1. ⏳ Create JSON Schema definitions for all event types
2. ⏳ Implement validation middleware
3. ⏳ Document event catalog
4. ⏳ Build schema registry
5. ⏳ Create TypeScript type definitions
