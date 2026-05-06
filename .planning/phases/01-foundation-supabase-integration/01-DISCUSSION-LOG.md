# Discussion Log: Phase 1

## Areas Discussed

### Supabase Client Architecture
- **Options presented**: Shared Lib Singleton, Context Provider, Supabase SSR (Recommended).
- **User selection**: **Supabase SSR**.
- **Rationale**: Best practice for Next.js App Router, handles cookie-based auth across Server and Client boundaries.

### Auth Flow & Identity
- **Decisions**:
  - Roll Number format: `UU` + fixed digits.
  - Dual login identifiers: Email and Roll Number.
  - Signups based on Roll Number.
- **Validation**: Signups include College ID upload with mock OCR cross-check and image metadata fraud detection.

### UI & Experience
- **Brand**: Deep Carbon & Neon Pulse.
- **Interaction**: Hybrid ID Drop-Zone (Drag & Drop + Camera).
- **Copywriting**: Gen-Z casual tone ("Drop your ID", "You're in").

## Deferred Ideas
- 3rd Party OCR API integration (User will handle later).

---
*Generated: 2026-05-06*
