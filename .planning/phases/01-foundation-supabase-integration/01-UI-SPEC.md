# Phase 1: Foundation & Supabase Integration - UI Design Contract

**Status:** Approved
**Reference**: [ui-guide.md](file:///home/greed/Downloads/around-you/ui-guide.md)

## 1. Visual Language (from ui-guide.md)

- **Themes**:
  - **Light (Bold Minimal)**: `--background` oklch(0.99 0 0), `--primary` indigo oklch(0.55 0.22 275).
  - **Dark (Vibrant & Playful)**: `--background` oklch(0.13 0.04 280), `--primary` electric purple oklch(0.6 0.25 300).
- **Typography**:
  - **Display**: Space Grotesk (700+ weight for headings).
  - **Body**: Inter (400-500 weight).
  - **Mono**: JetBrains Mono (for Roll Numbers and timestamps).
- **UI Pattern**: Glassmorphism with `--radius-xl` (16px) for cards and `--radius-lg` (12px) for buttons.
- **Shadows**: `--shadow-glow` (Dark mode only) for primary elements.

## 2. Components

### Auth Form (Signup/Login)
- **Container**: Card with `--radius-2xl` (24px), glassmorphic effect.
- **Inputs**: `--radius-md` (8px), border `--input`, focus ring `--ring`.
- **Copy**: "Let's get you in" (H1, Space Grotesk).

### ID Upload Drop-Zone (Feature specific)
- **Interaction**: Hybrid Drop-Zone (Drag & Drop + Mobile Camera/Gallery).
- **Visuals**: Dashed border using `--primary` color.
- **Copy**: "Drop your ID here" or "Let's see that ID".
- **States**: 
  - **Hover**: lift 1px + shadow-md.
  - **Active**: scale 0.98.

## 3. Feedback Loops

- **OCR Processing**: Shimmer animation (`bg-muted`) on the extraction field.
- **Success**: "Verified." with `--success` (Lime in dark mode, Emerald in light).
- **Failure**: "That's a miss. Try again." with `--destructive` (Red).

## 4. Voice & Tone (Gen-Z)

Follows Section 1 of [ui-guide.md](file:///home/greed/Downloads/around-you/ui-guide.md):
- Casual, peer-to-peer.
- "Yo, who's at the quad?" style.
- Use emoji in empty states and success messages.
- **Specific for this phase**:
  - Button: "Snag my spot" (Signup)
  - ID Prompt: "Drop your ID here fam"

## 5. Implementation Requirements

- [ ] Use CSS custom properties from `ui-guide.md` Section 3.1.
- [ ] Implement `<ThemeProvider>` as sketched in Section 13.2.
- [ ] Use Tailwind v4 `@theme inline` mapping for semantic tokens.
- [ ] Accessibility: WCAG AA minimum.

---
*Phase: 01-foundation-supabase-integration*
*UI-SPEC updated: 2026-05-06 via ui-guide.md*
