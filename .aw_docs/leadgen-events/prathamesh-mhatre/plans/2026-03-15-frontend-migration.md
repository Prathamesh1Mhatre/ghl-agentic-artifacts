---
namespace: leadgen-events
author: prathamesh-mhatre
type: plan
title: Vue 2 to Vue 3 Migration
date: 2026-03-15
status: complete
confidence: high
tags:
  - frontend
  - vue3
  - migration
  - breaking-change
---

# Vue 2 to Vue 3 Migration Plan

## Overview

Migrate leadgen events frontend from Vue 2 + Options API to Vue 3 + Composition API. Aligns with platform-wide Vue 3 adoption.

## Scope

### In Scope
- All Vue components (32 components)
- Vuex store → Pinia migration
- Vue Router v3 → v4 upgrade
- Build tooling (Webpack → Vite)
- Unit tests (Vue Test Utils v1 → v2)

### Out of Scope
- Backend API changes
- Design system updates
- New feature development

## Migration Strategy

**Incremental migration** - migrate component by component while maintaining backward compatibility.

### Phase 1: Setup (COMPLETE ✅)
- [x] Install Vue 3 and compatibility build
- [x] Update build tooling to Vite
- [x] Configure eslint and TypeScript
- [x] Update testing infrastructure

### Phase 2: Core Infrastructure (COMPLETE ✅)
- [x] Migrate Vuex to Pinia
- [x] Update Vue Router to v4
- [x] Migrate global plugins
- [x] Update event bus to mitt

### Phase 3: Component Migration (COMPLETE ✅)
**Leaf components first, containers last**

Week 1-2: Leaf Components (16 components)
- [x] Button, Input, Select, Checkbox, Radio
- [x] Card, Badge, Tag, Tooltip, Modal
- [x] Icon, Avatar, Spinner, Alert, Toast
- [x] Dropdown

Week 3-4: Composite Components (10 components)
- [x] EventCard, EventList, EventFilters
- [x] MetricCard, MetricGrid
- [x] ChartWrapper, TimeSeriesChart, FunnelChart
- [x] UserProfile, UserList

Week 5-6: Container Components (6 components)
- [x] DashboardLayout, SidebarNav
- [x] EventDashboard, AnalyticsView
- [x] SettingsPage, ProfilePage

### Phase 4: Testing & QA (COMPLETE ✅)
- [x] Unit test migration (all 87 tests passing)
- [x] E2E test updates (Cypress 12)
- [x] Visual regression testing
- [x] Performance benchmarking

### Phase 5: Deployment (COMPLETE ✅)
- [x] Feature flag rollout (100% traffic)
- [x] Remove Vue 2 compatibility build
- [x] Remove deprecated code
- [x] Documentation updates

## Breaking Changes

### Component API
**Before (Vue 2 Options API)**:
```vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

**After (Vue 3 Composition API)**:
```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
```

### Store (Vuex → Pinia)
**Before**:
```js
this.$store.dispatch('events/fetchEvents')
```

**After**:
```js
const eventsStore = useEventsStore()
eventsStore.fetchEvents()
```

### Event Bus
**Before**:
```js
this.$eventBus.$emit('event:updated')
```

**After**:
```js
import { emitter } from '@/utils/emitter'
emitter.emit('event:updated')
```

## Performance Improvements

| Metric | Vue 2 | Vue 3 | Improvement |
|--------|-------|-------|-------------|
| Bundle size | 487 KB | 312 KB | -36% |
| Initial load | 2.8s | 1.9s | -32% |
| Time to Interactive | 3.2s | 2.1s | -34% |
| Re-render time | 45ms | 28ms | -38% |

## Rollback Plan

1. Feature flag to 0% traffic
2. Redeploy previous version
3. Post-mortem and bug fixes
4. Retry deployment

## Lessons Learned

✅ **What Went Well**:
- Incremental migration prevented big-bang issues
- Vite build speed significantly improved DX
- Composition API improved code reusability
- TypeScript support much better in Vue 3

⚠️ **Challenges**:
- Some third-party libraries not Vue 3 compatible (had to fork)
- Testing library changes required significant test rewrites
- Team learning curve for Composition API patterns

📚 **Documentation Created**:
- Migration guide for other teams
- Composition API best practices
- Pinia store patterns
- Testing guide for Vue 3
