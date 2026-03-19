---
layout: artifact
title: "Artifact Registry Landing Page Design"
type: designs
namespace: leadgen-events
author: prathamesh-mhatre
date: 2026-03-19
tags: [ui-design, landing-page, registry, artifacts]
status: complete
confidence: high
---

# Artifact Registry Landing Page Design

## Design Overview

Professional landing page for the GHL Agentic Artifacts registry with namespace browsing, search, and statistics dashboard.

## Key Components

### Hero Section

- Large heading with gradient text effect
- Descriptive subtitle
- Centered layout
- Responsive typography (36px desktop, 30px mobile)

### Search Bar

- Prominent placement below hero
- Full-width input with rounded borders
- Placeholder: "Search artifacts across all namespaces..."
- Focus state with HighRise blue accent

### Stats Dashboard

- 4-column grid layout
- Cards showing:
  - Total Artifacts
  - Active Namespaces
  - Contributors
  - Last Updated
- Hover effects with subtle transform
- Large numbers in accent color

### Namespace Grid

- 6 namespace cards (Platform, Leadgen Events, Revex Courses, CRM, Automation, Mobile)
- Icon + name + artifact count
- Gradient top border on hover
- Card elevation on hover (translateY)
- Responsive: 3 columns → 2 columns → 1 column

### Recent Feed

- List of recent artifacts
- Title, type badge, author, date
- Hover effect with slide animation
- Empty state with helpful message

## Color Palette

### Light Mode
- Background: `#ffffff`
- Text: `#344054` (gray-700)
- Accent: `#2970ff` (primary-500)
- Borders: `#eaecf0` (gray-200)

### Dark Mode
- Background: `#0a0a0a`
- Text: `#a1a1aa`
- Accent: `#3b82f6`
- Borders: `#262626`

## Typography

- **Headings**: Inter, Bold (700)
- **Body**: Inter, Regular (400)
- **Display**: 36px (h1), 24px (h2)
- **Body**: 14px

## Interactions

- **Hover**: Cards lift with shadow and border color change
- **Focus**: Input shows HighRise blue ring
- **Theme Toggle**: Fixed button bottom-right
- **Transitions**: 200ms cubic-bezier

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus visible indicators
- Sufficient color contrast ratios

## Responsive Breakpoints

- Desktop: > 1024px (3-column namespace grid)
- Tablet: 768px - 1024px (2-column grid)
- Mobile: < 768px (single column, smaller text)

## Files

- Layout: `docs/_layouts/default.html`
- Page: `docs/index.html`
- Styles: `docs/assets/css/theme.css`
- Scripts: `docs/assets/js/stats.js`, `docs/assets/js/theme-toggle.js`
