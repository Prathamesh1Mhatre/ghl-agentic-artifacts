---
layout: artifact
title: "Artifact Publishing Workflow Implementation Plan"
type: plans
namespace: revex-courses
author: prathamesh-mhatre
date: 2026-03-19
tags: [workflow, publishing, automation, cli]
status: in_progress
confidence: high
---

# Artifact Publishing Workflow Implementation Plan

## Goal

Enable seamless publishing of `.aw_docs/` artifacts to the GHL Agentic Artifacts registry with automatic indexing and GitHub Pages deployment.

## Architecture

```
Local Workspace
    ↓
.aw_docs/ artifacts
    ↓
aw publish command
    ↓
Detection (namespace, author, type)
    ↓
Copy to Registry
    ↓
Inject frontmatter
    ↓
Update indexes (3 levels)
    ↓
Git commit & push
    ↓
GitHub Actions trigger
    ↓
Jekyll build
    ↓
GitHub Pages deploy
```

## Implementation Steps

### Phase 1: CLI Command (✅ Complete)

- [x] Create `libs/aw/commands/publish-github.mjs`
- [x] Add `aw publish` to CLI router
- [x] Implement namespace detection
  - Check `.aw-config.json`
  - Parse git remote URL
  - Prompt user if not found
- [x] Get git username automatically

### Phase 2: Artifact Processing (✅ Complete)

- [x] Copy artifact directory to registry
- [x] Inject YAML frontmatter into README.md
- [x] Required fields: title, type, namespace, author, date
- [x] Optional fields: tags, status, confidence
- [x] Preserve existing content

### Phase 3: Index Generation (✅ Complete)

- [x] **Level 1**: Namespace index (`platform/index.json`)
  - Total artifacts
  - Contributors list
  - Last updated timestamp
- [x] **Level 2**: User index (`platform/prathamesh-mhatre/index.json`)
  - Artifact types
  - Last updated
- [x] **Level 3**: Type index (`platform/prathamesh-mhatre/research/index.json`)
  - List of artifacts with metadata
  - URLs, dates, tags

### Phase 4: Search & Feed (⏳ Pending)

- [ ] Generate `search-index.json` for client-side search
- [ ] Generate `recent.json` for recent feed
- [ ] Update on every publish

### Phase 5: Git Operations (✅ Complete)

- [x] `git add` new/modified files
- [x] Commit with descriptive message
- [x] Push to main branch
- [x] Trigger GitHub Actions automatically

### Phase 6: GitHub Pages (✅ Complete)

- [x] Jekyll configuration (`_config.yml`)
- [x] GitHub Actions workflow (`.github/workflows/publish.yml`)
- [x] Auto-deploy to `gh-pages` branch
- [x] Site live at `gohighlevel.github.io/ghl-agentic-artifacts/`

## Usage

```bash
# Basic usage
aw publish .aw_docs/research/2026-03-19-my-research/

# Override namespace
aw publish .aw_docs/research/2026-03-19-my-research/ --namespace platform

# Dry run
aw publish .aw_docs/research/2026-03-19-my-research/ --dry-run

# Open in browser after publishing
aw publish .aw_docs/research/2026-03-19-my-research/ --open
```

## Artifact Types Supported

- `research` - Research findings and analysis
- `specs` - Product specifications
- `designs` - UI/UX designs and prototypes
- `plans` - Implementation plans
- `reviews` - Code reviews and audits
- `learnings` - Lessons learned
- `runs` - Workflow execution traces

## Directory Structure

```
docs/.aw_docs/
├── platform/
│   ├── index.json
│   ├── search-index.json
│   ├── recent.json
│   └── prathamesh-mhatre/
│       ├── index.json
│       └── research/
│           ├── index.json
│           └── 2026-03-19-test-artifact/
│               └── README.md
```

## Success Metrics

- Publish time: < 10 seconds
- GitHub Pages deploy: < 2 minutes
- Zero manual steps required
- All artifacts browsable via web UI
- Search functionality working
- Recent feed updating

## Current Status

✅ Core publishing workflow complete
✅ Jekyll site configured
✅ GitHub Actions working
⏳ Search index generation pending
⏳ Recent feed generation pending

## Next Steps

1. Implement search index generation
2. Implement recent feed generation
3. Add artifact screenshots/previews support
4. Add artifact versioning
5. Add artifact tagging system
