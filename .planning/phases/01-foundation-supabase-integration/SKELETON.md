# Phase 1: Walking Skeleton (SKELETON.md)

**Goal**: Verify the "end-to-end" path from Local Dev → Supabase → Frontend → UI tokens.

## 1. Core Path
- [x] **Next.js Project**: Root `app/` structure with `src/` layout.
- [x] **Tailwind v4**: `@theme inline` mapping active and working.
- [x] **Supabase Connectivity**: `supabase.auth.getSession()` returns without error.
- [x] **Fonts**: Space Grotesk rendering on H1s.

## 2. Minimal Success Criteria
- The landing page displays "Around You" in Space Grotesk.
- Theme toggle switches between "Bold Minimal" and "Vibrant & Playful".
- A ".env.local" template exists for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---
*Created: 2026-05-06*
