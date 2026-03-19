# GHL Agentic Artifacts Registry

**Private artifact repository for GoHighLevel teams**

Centralized storage for agentic workspace artifacts: research, specs, designs, plans, reviews, and learnings.

---

## 🚀 Quick Links

- **Browse Artifacts:** https://gohighlevel.github.io/ghl-agentic-artifacts/
- **Search:** https://gohighlevel.github.io/ghl-agentic-artifacts/search.html
- **Documentation:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📁 Structure

```
docs/.aw_docs/
├── platform/               # Platform team namespace
│   ├── prathamesh1mhatre/
│   │   ├── research/
│   │   ├── specs/
│   │   ├── designs/
│   │   ├── plans/
│   │   ├── reviews/
│   │   ├── learnings/
│   │   └── runs/
│   └── claude-agent/
├── leadgen-events/         # Leadgen Events team namespace
├── revex-courses/          # Revex Courses team namespace
├── crm/
├── automation/
└── mobile/
```

---

## 🔍 Usage

### Publish an Artifact

From your local workspace:

```bash
# Generate artifact (e.g., via /aw:research command)
/aw:research "feature X"

# Auto-publishes to:
# .aw_docs/<namespace>/<git-username>/research/2026-03-19-feature-x/
```

### Manual Publish

```bash
aw publish .aw-docs/research/2026-03-19-my-research/

# Prompts for namespace if not set
# Copies to ghl-agentic-artifacts repo
# Commits and pushes to GitHub
# Returns GitHub Pages URL
```

### Browse Artifacts

1. **By Team:** https://gohighlevel.github.io/ghl-agentic-artifacts/.aw_docs/platform/
2. **By User:** https://gohighlevel.github.io/ghl-agentic-artifacts/.aw_docs/platform/prathamesh1mhatre/
3. **By Type:** https://gohighlevel.github.io/ghl-agentic-artifacts/.aw_docs/platform/prathamesh1mhatre/research/

---

## 🏷️ Artifact Types

| Type | Description | Example |
|------|-------------|---------|
| **research** | Product research, competitive analysis | `2026-03-19-ghl-agentic-artifacts/` |
| **specs** | Validated product specs | `2026-03-15-membership-refactor/` |
| **designs** | HTML prototypes, design reviews | `2026-03-18-calendar-redesign/` |
| **plans** | Implementation plans, architecture docs | `2026-03-17-migration-plan/` |
| **reviews** | Code reviews, design reviews | `2026-03-16-pr-1234-review/` |
| **learnings** | Solutions, patterns, postmortems | `2026-03-14-redis-timeout-solution/` |
| **runs** | Workflow run artifacts (transparency logs) | `2026-03-19T14-30-research-pipeline/` |

---

## 🎨 Frontmatter

All markdown files must have YAML frontmatter:

```yaml
---
title: "GHL Agentic Artifacts Registry"
type: research
namespace: platform
author: prathamesh1mhatre
date: 2026-03-19
tags: [artifacts, registry, github-pages]
status: complete
related_artifacts:
  - platform/prathamesh1mhatre/specs/2026-03-19-ghl-agentic-artifacts/SPEC.md
confidence: high
---
```

---

## 🛠️ Development

### Local Preview

```bash
cd ghl-agentic-artifacts/docs
bundle install
bundle exec jekyll serve
# Open http://localhost:4000
```

### Generate Indexes

```bash
./scripts/generate-indexes.sh
```

### Validate Frontmatter

```bash
./scripts/validate-frontmatter.sh
```

---

## 📊 Stats

- **Total Artifacts:** Auto-updated daily
- **Active Namespaces:** 6 teams
- **Contributors:** Auto-counted
- **Last Updated:** Auto-updated on each push

---

## 🔒 Access

This is a **private repository**. Access limited to GoHighLevel organization members.

---

## 📝 License

Internal use only. © 2026 GoHighLevel.
