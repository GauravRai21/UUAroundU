# Phase 1: Foundation & Supabase Integration - Plan

**Goal**: Deliver a working Next.js scaffold with Supabase Auth and DB ready for data.
**Mode**: mvp (Walking Skeleton)

## 1. Plan: 01-01 - Walking Skeleton & Supabase Init
**Description**: Initialize the core Next.js project and set up the Supabase infrastructure.

### Tasks
- [x] **Task 01-01-01**: Initialize Next.js 15+ project with TypeScript and Tailwind CSS v4.
- [x] **Task 01-01-02**: Implement `src/styles/globals.css` with OKLCH tokens from `ui-guide.md`.
- [x] **Task 01-01-03**: Set up `ThemeProvider` and root layout with Space Grotesk and Inter fonts.
- [x] **Task 01-01-04**: Install and configure `@supabase/ssr` client helpers (Server, Client, Middleware).
- [x] **Task 01-01-05**: Create a basic "Check Connection" page to verify Supabase connectivity.

## 2. Plan: 01-02 - Auth Layer & ID Verification
**Description**: Build the secure, Gen-Z styled signup flow with ID verification.

### Tasks
- [x] **Task 01-02-01**: Create `profiles` table in Supabase with `roll_number` (UNIQUE) and `is_verified` columns.
- [x] **Task 01-02-02**: Build the `SignupForm` component using "Gen-Z" copy and "UU" Roll Number validation logic.
- [x] **Task 01-02-03**: Implement the `IdUploadZone` (Hybrid Drop-Zone) with dashed neon borders and mobile camera support.
- [x] **Task 01-02-04**: Implement `verify-id` API route (mock OCR + image metadata check for AI-generation markers).
- [x] **Task 01-02-05**: Integrate Supabase Auth sign-up with the custom `profiles` creation flow.

## 3. Verification Plan
- [ ] **VERIFY-01**: Access the app and confirm the "Deep Carbon" theme loads correctly.
- [ ] **VERIFY-02**: Attempt signup with an invalid Roll Number (non-UU) and verify rejection.
- [ ] **VERIFY-03**: Upload a sample ID image and confirm the mock OCR extraction matches the input.
- [ ] **VERIFY-04**: Successfully log in with both Email and Roll Number.

---
*Generated: 2026-05-06*
