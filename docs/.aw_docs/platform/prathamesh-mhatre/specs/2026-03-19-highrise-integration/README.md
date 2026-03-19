---
layout: artifact
title: "HighRise Design System Integration"
type: specs
namespace: platform
author: prathamesh-mhatre
date: 2026-03-19
tags: [design-system, highrise, integration, ui]
status: complete
confidence: high
---

# HighRise Design System Integration

## Overview

Integration of the official GoHighLevel HighRise design system into the GHL Agentic Artifacts registry.

## Objectives

1. Replace custom design tokens with official HighRise tokens
2. Implement professional light/dark mode theming
3. Ensure WCAG 2.1 AA accessibility compliance
4. Provide smooth theme toggle experience

## Design Tokens Implemented

### Colors

- **Primary Brand**: `#2970ff` (--primary-500)
- **Gray Scale**: 9 levels from --gray-25 to --gray-900
- **Semantic Colors**: Error, Success, Warning scales
- **Dark Mode**: True black backgrounds (#0a0a0a)

### Typography

- **Text Sizes**: 11 levels (4xs to 4xl)
- **Display Sizes**: 4 levels (xs to lg)
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Line Heights**: Matched to each size

### Spacing

- **8-Point Grid**: --space-1 (4px) to --space-24 (96px)
- Consistent spacing throughout UI

### Effects

- **Shadows**: 5 elevation levels
- **Radius**: 6 border radius options
- **Transitions**: Fast (150ms), Base (200ms), Slow (300ms)

## Implementation Details

### Theme Toggle

- Fixed position button (bottom-right)
- localStorage persistence
- System preference detection
- Smooth CSS transitions
- Sun/moon icon indicators

### Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 1024px
- Adaptive typography using clamp()
- Touch-friendly interactive elements

## Success Criteria

- ✅ All HighRise tokens integrated
- ✅ Light mode as default
- ✅ Dark mode fully functional
- ✅ Theme toggle working
- ✅ No CSS variable errors
- ✅ Deployed to GitHub Pages

## Links

- [HighRise Documentation](https://highrise.gohighlevel.com)
- [Live Site](https://prathamesh1mhatre.github.io/ghl-agentic-artifacts/)
- [Source Code](https://github.com/Prathamesh1Mhatre/ghl-agentic-artifacts)
