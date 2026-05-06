# Phase 1: Foundation & Supabase Integration - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a working Next.js scaffold with Supabase Auth and DB ready for data. This includes the core authentication flow, database initialization, and a secure signup process incorporating College ID verification.

</domain>

<decisions>
## Implementation Decisions

### Auth Architecture
- **Supabase SSR**: Use the official `@supabase/ssr` package for cookie-based auth management across Next.js Server Components, Client Components, and Middleware.
- **Dual Login Identifiers**: Support authentication via both Email and Roll Number (Unique ID).
- **Roll Number Format**: Enforce "UU" prefix followed by a fixed number of digits (e.g., `UU23150010012`).

### Signup & Verification Flow
- **Roll-Number-First Signup**: Initial user registration is driven by the Roll Number.
- **ID Verification**: Integrate a College ID upload step.
- **OCR Validation**: Use a mock OCR response for now that extracts text from the uploaded ID.
- **Cross-Check**: Validate that the extracted OCR text matches the Roll Number and other details entered by the user.
- **Fraud Detection**: Implement a check on image metadata (EXIF/etc.) to flag potentially AI-generated or edited ID cards.

### the agent's Discretion
- **Supabase Client Library**: placement and internal organization of Supabase-related hooks and utilities.
- **Directory Structure**: Choice of `src/` layout vs. root-level `app/` router layout (defaulting to standard `src/` layout if not specified).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core References
- `.planning/PROJECT.md` — Project overview and key decisions.
- `.planning/REQUIREMENTS.md` — Requirement AUTH-01 through AUTH-04.
- `old-code/` — Reference for legacy Vite + React implementation.

### External Documentation
- [Supabase Next.js Auth Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) — Use as reference for SSR patterns.

</canonical_refs>

<specifics>
## Specific Ideas

- **Mock OCR JSON**: `{"roll_number": "UU23150010012", "name": "...", "expiry": "..."}`
- **Metadata Check**: Focus on detecting missing EXIF data or common AI-generation markers in image headers.

</specifics>

<deferred>
## Deferred Ideas

- **Actual OCR Integration**: Postponed until the user sets up the specific 3rd party API.
- **Marketplace & Events**: Deferred to v2 or later phases.

</deferred>

---

*Phase: 01-foundation-supabase-integration*
*Context gathered: 2026-05-06 via discussion*
