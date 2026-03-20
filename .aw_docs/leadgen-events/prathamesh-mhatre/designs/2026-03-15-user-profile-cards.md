---
namespace: leadgen-events
author: prathamesh-mhatre
type: design
title: User Profile Cards
date: 2026-03-15
status: review
confidence: high
tags:
  - user-profile
  - cards
  - components
---

# User Profile Cards

## Overview

Compact user profile card components for displaying lead information in dashboards, lists, and detail views.

## Variants

### 1. Compact Card (160px × 240px)
- Avatar/initials
- Name and title
- Company
- 2-3 key metrics
- Primary action button

### 2. Standard Card (280px × 360px)
- Avatar with status indicator
- Full name and title
- Company and location
- Contact information preview
- 4-5 key metrics
- Multiple action buttons
- Tags/labels

### 3. Expanded Card (320px × 480px)
- All Standard Card features
- Recent activity timeline
- Quick notes section
- Task/reminder indicators
- Social media links

## Interactive States

- **Default**: Standard elevation, neutral colors
- **Hover**: Increased elevation, highlight border
- **Selected**: Accent border, subtle background tint
- **Disabled**: Reduced opacity, no interactions

## Data Fields

### Primary
- Avatar image or initials
- Full name
- Job title
- Company name

### Secondary
- Email (with click-to-copy)
- Phone (with click-to-call)
- Location (city, state)
- Last contact date

### Metrics
- Lead score
- Engagement level
- Days in pipeline
- Revenue potential

## Actions

- View full profile
- Send email
- Schedule call
- Add to campaign
- Edit contact

## Implementation Notes

- Built with Vue 3 Composition API
- Uses HighRise `<hl-card>` component as base
- Supports skeleton loading state
- Lazy loads avatar images
- Caches metric data for performance
