# Around You

## What This Is

A Next.js (App Router) + TypeScript migration of an existing Vite + React application. The product is being updated to take advantage of Server Components and optimize UI/SEO, while cleanly separating the backend WebSocket (Socket.io) server into its own repository.

## Core Value

A seamlessly real-time, responsive user experience delivered through a modern, SEO-optimized Next.js architecture.

## Requirements

### Validated

- ✓ Existing React UI features (from the legacy Vite app)
- ✓ Real-time communication foundation via Socket.io
- ✓ Express backend handling data processing

### Active

- [ ] Migrate Vite + React app to Next.js App Router setup
- [ ] Convert all JavaScript source files to strict TypeScript
- [ ] Refactor Socket.io client logic to work cleanly within Next.js App Router
- [ ] Optimize UI components and SEO leveraging Next.js capabilities
- [ ] Separate the WebSocket/Express backend into a distinct repository setup

### Out of Scope

- [ ] Merging the backend into Next.js API routes — The backend relies heavily on Socket.io, which doesn't fit Next.js serverless architecture natively, so the Express server stays separate.

## Context

- The current source code for the legacy Vite client and Express server is available in `old-code/` for reference.
- The UI uses Tailwind CSS v4.
- The migration aims to add new UI refinements and optimize SEO.

## Constraints

- **Architecture**: Next.js App Router must be used for the frontend.
- **Language**: Strict TypeScript must be enforced.
- **Backend**: The Express + Socket.io backend must remain a separate service due to long-polling WebSocket requirements.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Offers better SEO, Server Components, and modern routing. | — Pending |
| Separate Backend Repo | Next.js serverless functions do not natively support long-lived WebSocket connections. | — Pending |
| Socket.io Refactor | Need to adapt existing socket connections to Next.js SSR and Client boundaries. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-06 after initialization*
