# Architecture

**Analysis Date:** 2026-05-06

## System Design

**Pattern:**
- Next.js App Router (React Server Components)
- Client-server split architecture

**Layers:**
- `app/` - Routing and presentation layer
- Express backend - Data processing and WebSocket layer (planned)

## Data Flow

1. Next.js serves React Server Components and Client Components
2. Client communicates with Express backend via HTTP and Socket.io
3. Real-time updates handled by Socket.io client context (planned)

## Entry Points

- `app/layout.tsx` - Root layout and global providers
- `app/page.tsx` - Landing page

## Abstractions

- React Context for Socket.io state management (planned)

---

*Architecture analysis: 2026-05-06*
*Update after major architecture changes*
