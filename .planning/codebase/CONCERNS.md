# Areas of Concern

**Analysis Date:** 2026-05-06

## Technical Debt

- Currently undergoing migration from Vite + React to Next.js + TypeScript. The original source is kept in `old-code/` for reference during this process.

## Known Issues

- Need to properly initialize Socket.io in a `"use client"` context to prevent multiple connections during SSR.
- TypeScript types need to be finalized for migrated components.

## Fragile Areas

- The integration between the Next.js frontend and the Express backend/Socket.io server needs careful handling, especially regarding CORS and environment variables.

## Security

- Ensure no sensitive tokens or API keys are exposed to the client inadvertently.

---

*Concerns analysis: 2026-05-06*
*Update after major concern changes*
