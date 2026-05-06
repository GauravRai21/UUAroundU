# CampusHub — UI Guide

> The single source of truth for visual and interaction design.
> Built for Gen Z college students. Mobile-first. Themeable. Opinionated.

---

## Table of Contents

1. [Brand Foundation](#1-brand-foundation)
2. [Theming Strategy](#2-theming-strategy)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing, Radius, Elevation](#5-spacing-radius-elevation)
6. [Motion](#6-motion)
7. [Component Specs](#7-component-specs)
8. [Feature Section Guidelines](#8-feature-section-guidelines)
9. [Iconography](#9-iconography)
10. [Imagery](#10-imagery)
11. [Accessibility](#11-accessibility)
12. [Layout & Responsive](#12-layout--responsive)
13. [Implementation Notes](#13-implementation-notes)
14. [Do's & Don'ts](#14-dos--donts)
15. [Future / Out of Scope](#15-future--out-of-scope)

---

## 1. Brand Foundation

**Product**: CampusHub
**Tagline**: *Your campus. All connected.*
**Audience**: College students aged 17–24. Phone-native, fluent in Discord/Instagram/TikTok UI patterns. Low patience for friction.

**What we are**: A single home for campus chat, marketplace, events, and lost & found.
**What we are not**: A corporate intranet. A school-administered LMS. A formal social network.

### Voice & Tone

| Do say | Don't say |
|---|---|
| "Yo, who's at the quad?" | "Greetings, fellow scholars." |
| "Snagged it 🔥" | "Item successfully reserved." |
| "Lost your AirPods? We got you." | "Submit a lost item report." |
| "Spring Fest is popping off Saturday" | "Please be advised of Spring Fest." |

Casual, peer-to-peer, dry humor welcome. Emoji are part of the vocabulary, not decoration. Never condescend; never sound like an admin email.

### Core Principles

1. **Mobile-first** — every layout designed for one thumb at 375px before scaling up.
2. **Fast** — perceived speed > absolute speed. Skeletons, optimistic UI, no spinners > 400ms.
3. **Inclusive** — WCAG AA minimum, AAA for body text. Reduced motion respected.
4. **Playful but functional** — personality lives in microcopy, motion, and empty states; never in critical paths.
5. **Opinionated** — we make defaults so users don't have to choose.

---

## 2. Theming Strategy

CampusHub ships **two complete themes** that are equally first-class:

| Mode | Palette | Default for |
|---|---|---|
| **Light** | Bold Minimal (indigo + coral + amber + emerald) | System light, daytime use, classroom |
| **Dark** | Vibrant & Playful (electric purple + hot pink + lime + deep navy) | System dark, evening, dorm/social use |

### Toggle

Three-way toggle stored in `localStorage` under `campushub:theme`:

- `system` (default) — follows `prefers-color-scheme`
- `light` — force Bold Minimal
- `dark` — force Vibrant & Playful

The toggle lives in the header on desktop and inside the Profile tab on mobile. We **never** auto-switch mid-session except when the OS preference changes and the user is in `system` mode.

### How it works

All color decisions are CSS custom properties on `:root` (light) and `.dark` (dark). A `<ThemeProvider>` adds/removes the `.dark` class on `<html>`. Components only ever reference semantic tokens (e.g. `bg-primary`), never hex.

```ts
// Pseudocode
const theme = localStorage.getItem('campushub:theme') ?? 'system';
const resolved = theme === 'system'
  ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : theme;
document.documentElement.classList.toggle('dark', resolved === 'dark');
```

---

## 3. Color System

### 3.1 Semantic Tokens

All values in `oklch`. Hex equivalents shown for reference only — **never hardcode hex in components**.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `oklch(0.99 0 0)` ≈ `#FAFAFA` | `oklch(0.13 0.04 280)` ≈ `#0F0F1A` | App background |
| `--foreground` | `oklch(0.15 0.02 270)` ≈ `#0A0A0A` | `oklch(0.98 0.005 270)` ≈ `#FAFAFA` | Body text |
| `--card` | `oklch(1 0 0)` ≈ `#FFFFFF` | `oklch(0.18 0.04 280)` ≈ `#1A1A2E` | Card surface |
| `--card-foreground` | same as `--foreground` | same as `--foreground` | Text on card |
| `--muted` | `oklch(0.96 0.01 270)` ≈ `#F4F4F6` | `oklch(0.22 0.04 280)` ≈ `#22223A` | Subtle bg |
| `--muted-foreground` | `oklch(0.45 0.02 270)` ≈ `#6B6B7B` | `oklch(0.65 0.04 280)` ≈ `#9A9AB5` | Secondary text |
| `--border` | `oklch(0.92 0.01 270)` ≈ `#E5E5EA` | `oklch(0.28 0.04 280)` ≈ `#2D2D45` | Dividers, outlines |
| `--input` | same as `--border` | same as `--border` | Form field border |
| `--ring` | `oklch(0.6 0.18 280)` indigo | `oklch(0.65 0.25 300)` purple | Focus ring |
| `--primary` | `oklch(0.55 0.22 275)` ≈ `#4F46E5` indigo | `oklch(0.6 0.25 300)` ≈ `#7C3AED` electric purple | CTAs, links, brand |
| `--primary-foreground` | `oklch(0.99 0 0)` white | `oklch(0.99 0 0)` white | Text on primary |
| `--secondary` | `oklch(0.96 0.01 270)` | `oklch(0.22 0.04 280)` | Secondary buttons |
| `--secondary-foreground` | same as `--foreground` | same as `--foreground` | Text on secondary |
| `--accent` | `oklch(0.7 0.2 15)` ≈ `#FB7185` coral | `oklch(0.65 0.27 0)` ≈ `#EC4899` hot pink | Highlights, badges |
| `--accent-foreground` | white | white | Text on accent |
| `--success` | `oklch(0.65 0.15 165)` ≈ `#10B981` emerald | `oklch(0.85 0.22 130)` ≈ `#A3E635` lime | Success, found |
| `--warning` | `oklch(0.75 0.16 70)` ≈ `#F59E0B` amber | `oklch(0.78 0.17 70)` ≈ `#F59E0B` amber | Events, attention |
| `--destructive` | `oklch(0.6 0.22 25)` ≈ `#EF4444` red | `oklch(0.65 0.24 25)` ≈ `#F87171` red | Delete, errors |

### 3.2 Feature Color Mapping

Each of the four core features owns a color so users learn the system spatially:

| Feature | Light token | Dark token | Use for |
|---|---|---|---|
| **Chat** | `--primary` (indigo) | `--primary` (purple) | Bubbles, send button, presence dot |
| **Marketplace** | `--accent` (coral) | `--accent` (pink) | Price tags, "Buy" button, category pill |
| **Events** | `--warning` (amber) | `--warning` (amber) | Date block, "RSVP" button, "Live now" |
| **Lost & Found** | `--success` (emerald) | `--success` (lime) | Found tag, location pin, claim button |

This is **a guideline, not a rule** — the CTA in any flow always uses `--primary` for visual hierarchy.

### 3.3 Gradients

```css
/* Hero / brand moments */
--gradient-brand: linear-gradient(135deg,
  oklch(from var(--primary) l c h),
  oklch(from var(--accent) l c h));

/* Subtle card hover (dark only) */
--gradient-glow: radial-gradient(circle at top,
  oklch(from var(--primary) l c h / 0.15), transparent 70%);
```

Use sparingly — hero, empty states, the FAB, achievement moments. **Never on body text**.

### 3.4 Shadows & Glow

| Token | Light | Dark |
|---|---|---|
| `--shadow-sm` | `0 1px 2px oklch(0 0 0 / 0.05)` | `0 1px 2px oklch(0 0 0 / 0.4)` |
| `--shadow-md` | `0 4px 12px oklch(0 0 0 / 0.08)` | `0 4px 12px oklch(0 0 0 / 0.5)` |
| `--shadow-lg` | `0 12px 32px oklch(0 0 0 / 0.12)` | `0 12px 32px oklch(0 0 0 / 0.6)` |
| `--shadow-glow` | not used | `0 0 32px oklch(from var(--primary) l c h / 0.4)` |

Glow is a **dark-mode-only** signature — buttons, the FAB, and active nav items get a subtle primary glow on hover/active.

---

## 4. Typography

### 4.1 Font Stack

| Role | Font | Fallback | Why |
|---|---|---|---|
| Display | **Space Grotesk** | `system-ui, sans-serif` | Distinctive, geometric, not overused like Poppins |
| Body | **Inter** | `system-ui, sans-serif` | Best-in-class screen legibility |
| Mono | **JetBrains Mono** | `ui-monospace, monospace` | Prices, codes, timestamps |

Load via `@fontsource` or Google Fonts with `display: swap`. Self-host in production.

### 4.2 Type Scale

| Token | Size / Line-height | Weight | Use |
|---|---|---|---|
| `text-xs` | 12 / 16 | 500 | Captions, timestamps |
| `text-sm` | 14 / 20 | 400 | Secondary text |
| `text-base` | 16 / 24 | 400 | Body (default) |
| `text-lg` | 18 / 28 | 500 | Lead paragraph |
| `text-xl` | 20 / 28 | 600 | Card titles |
| `text-2xl` | 24 / 32 | 600 | Section headers |
| `text-3xl` | 30 / 36 | 700 | Page titles (H1 mobile) |
| `text-4xl` | 36 / 40 | 700 | Hero (mobile) |
| `text-5xl` | 48 / 52 | 700 | Hero (desktop) |
| `text-6xl` | 60 / 64 | 800 | Marketing only |

Display sizes (`3xl+`) use **Space Grotesk**. Everything else uses **Inter**.

### 4.3 Heading Hierarchy

- One `<h1>` per page (route).
- Skip no levels (`h2` after `h1`, never `h3`).
- Headings use `tracking-tight` (-0.02em). Body uses default tracking.
- Never style a non-heading as a heading just to make it big — use `text-2xl font-semibold` on a `<p>` instead.

---

## 5. Spacing, Radius, Elevation

### 5.1 Spacing Scale

4px base. Use Tailwind's default `1` = 4px scale. Avoid arbitrary values.

Common rhythm:

| Use | Value |
|---|---|
| Icon-to-text | 8px (`gap-2`) |
| Inside card padding | 16px (`p-4`) |
| Between cards | 12px (`gap-3`) |
| Section vertical | 48–64px (`py-12` / `py-16`) |
| Page horizontal (mobile) | 16px (`px-4`) |
| Page horizontal (desktop) | 24px (`px-6`) |

### 5.2 Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | Tags, badges |
| `--radius-md` | 8px | Inputs, small buttons |
| `--radius-lg` | 12px | Buttons, dropdowns |
| `--radius-xl` | 16px | Cards |
| `--radius-2xl` | 24px | Sheets, modals, hero cards |
| `--radius-full` | 9999px | Avatars, pills, FAB |

CampusHub leans **rounded** — never use sharp corners (radius 0–4px) in product UI. Sharp corners are reserved for typography accents only.

### 5.3 Elevation Layers

```
0 — flat (page bg, dividers)
1 — card resting (--shadow-sm)
2 — card hover, dropdown (--shadow-md)
3 — modal, sheet, popover (--shadow-lg)
4 — toast, FAB (--shadow-lg + glow on dark)
```

Never stack more than 2 elevation layers on top of each other.

---

## 6. Motion

### 6.1 Tokens

| Token | Value |
|---|---|
| `--duration-fast` | 150ms |
| `--duration-base` | 250ms |
| `--duration-slow` | 400ms |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoots — use sparingly) |

### 6.2 When to Animate

| Animation | Duration | Easing |
|---|---|---|
| Hover lift on card | fast | ease-out |
| Button press | fast | ease-out |
| Page transition | base | ease-out |
| Sheet/modal slide-in | base | ease-spring |
| Chat message arrival | fast | ease-out |
| Toast entrance | base | ease-spring |
| FAB tap | fast | ease-spring |
| Confetti on RSVP/sale | slow | — |

### 6.3 Reduced Motion

Wrap all non-essential motion behind `@media (prefers-reduced-motion: no-preference)`. Critical state changes (toast, error) still animate but at `duration-fast` with linear easing.

---

## 7. Component Specs

For each: **anatomy → variants → states → notes**.

### 7.1 Button

**Anatomy**: `[icon?] label [icon?]`. Min height 44px (touch target).

**Variants**:

| Variant | Appearance | Use |
|---|---|---|
| `primary` | Filled `--primary`, white text | Main CTA per screen |
| `secondary` | Filled `--secondary`, fg text | Cancel, alt action |
| `outline` | Transparent, `--border` ring | Tertiary action |
| `ghost` | Transparent, hover bg only | In-card, inline |
| `destructive` | Filled `--destructive`, white | Delete, leave |
| `hero` | `--gradient-brand`, glow on dark | Marketing, onboarding |
| `icon` | Square, only icon | Toolbar, header |

**States**: `default`, `hover` (lift 1px + shadow), `active` (press 1px down), `focus-visible` (2px `--ring` offset 2), `disabled` (50% opacity, no pointer events), `loading` (spinner replaces label, width preserved).

**Don't**: Stack two `primary` buttons next to each other. Use `primary + ghost`.

### 7.2 Input / Textarea / Search

- Height 44px (input), auto (textarea, min 80px).
- Border `--input`, focus ring `--ring` 2px offset 0.
- Label above, helper text below at `text-xs muted-foreground`.
- Error state: border `--destructive`, helper text `--destructive`, no shake animation.
- Search input has leading `Search` icon and trailing clear `X` when value present.

### 7.3 Card

Three flavors, all radius `xl`, padding `p-4`, bg `--card`, border `1px --border` (light) or no border + glow shadow (dark).

| Flavor | Image | Layout |
|---|---|---|
| **Marketplace** | Top, square aspect, radius `lg` | Image → title → price (mono, accent) → seller row |
| **Event** | Right or top, radius `lg` | Date block (left, accent bg) → title → meta → RSVP button |
| **Lost & Found** | Left thumbnail | Status tag → title → location → time → claim button |

**Hover (desktop)**: translate-y -2px, shadow-md. **Tap (mobile)**: scale 0.98.

### 7.4 Chat Bubble

- **Mine**: aligned right, bg `--primary`, text `--primary-foreground`, radius `2xl` with bottom-right `md` (tail).
- **Theirs**: aligned left, bg `--muted`, text `--foreground`, radius `2xl` with bottom-left `md`.
- Avatar (28px) on first message of a streak only.
- Timestamp in `text-xs muted-foreground`, shown on long-press / hover.
- Reactions: pill row below bubble, max 4 visible + counter.
- Typing indicator: 3 dots with stagger animation, bg `--muted`.
- Read receipt: tiny double-check icon at bubble base, accent color when read.

**Slide-in**: new messages animate `translateY(8px) opacity(0) → 0/1` over `duration-fast`.

### 7.5 Avatar

- Sizes: `xs` 24, `sm` 32, `md` 40, `lg` 56, `xl` 80.
- Always `radius-full`.
- Fallback: initials (max 2 chars), bg derived from username hash → consistent color per user.
- **Online dot**: 25% width, bottom-right, `--success`, ring `2px --background`.

### 7.6 Badge / Tag / Chip

Three sizes (`sm` 20px, `md` 24px, `lg` 28px), all `radius-full`.

| Style | Use |
|---|---|
| `solid` (filled accent) | Status (Featured, Live, New) |
| `subtle` (10% accent bg + accent fg) | Category, condition |
| `outline` (border only) | Filters, removable chips |

Removable chips have a trailing `X` icon at `text-xs`.

### 7.7 Bottom Navigation Bar (mobile)

5 slots. Center is the **FAB** (Floating Action Button).

```
[Home] [Chats] [ + ] [Events] [Profile]
```

- Height 64px + safe-area-inset-bottom.
- Active item: icon filled, label `--primary`, icon scale 1.1.
- Inactive: icon outline, label `--muted-foreground`.
- FAB: 56px circle, `--primary` bg, white `+`, glow shadow on dark, lifted 8px above bar.
- Tap FAB → opens contextual sheet (post item, create event, report lost/found).

### 7.8 Top Bar / Header

- Height 56px mobile, 64px desktop.
- Mobile: `[ back/menu | title centered | action icon ]`.
- Desktop: `[ logo | nav links | search | theme toggle | avatar ]`.
- Sticky, `backdrop-blur` with `bg-background/80`.
- Border-bottom only when scrolled (toggle on `scrollY > 8`).

### 7.9 Modal / Sheet / Drawer

- **Mobile** → bottom sheet, `radius-2xl` top corners, drag handle, max 90vh.
- **Desktop** → centered modal, `radius-2xl`, max 560px wide.
- Backdrop: `--background/60` + `backdrop-blur-sm`.
- Trap focus, return focus on close, `Esc` closes.

### 7.10 Toast

- Bottom-center mobile, top-right desktop.
- 4 variants: `default`, `success`, `warning`, `destructive`.
- Auto-dismiss 4s (8s for destructive). Swipe to dismiss.
- Never block UI. Never use for critical confirmations — use modal.

### 7.11 Empty States

Every list/grid has a designed empty state:

```
[ illustration or large icon ]
Headline (text-xl, semibold)
One-line subhead (muted-foreground)
[ Primary action button ]
```

Tone: friendly + actionable. "No messages yet — say hi 👋" not "0 results found."

### 7.12 Skeleton Loaders

- `bg-muted` with shimmer animation (1.5s, ease-in-out, infinite).
- Mirror final layout shape — same radius, same dimensions.
- Never show > 6 skeleton items; after that, paginate or use spinner.

### 7.13 Theme Toggle

Three-segment control: `[ ☀ Light | 💻 System | 🌙 Dark ]`.
Active segment: `bg-background shadow-sm`. Other segments: transparent.
Whole control bg: `--muted`, `radius-full`, padding 4px.

---

## 8. Feature Section Guidelines

### 8.1 Chat

- Channel list: avatar + name + last message preview (1 line, ellipsis) + timestamp + unread badge (`--accent`).
- Unread badge: pill, `--primary` bg, white text, min-width 20px.
- Group chat avatar: stacked (max 3 with `+N`).
- Empty channel: illustration + "Be the first to say something."
- @mentions render as `--primary` pills inline.
- Image messages: max 240px wide on mobile, `radius-lg`, tap to expand.

### 8.2 Marketplace

- Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop. `gap-3`.
- Price always in **JetBrains Mono**, color `--accent`, `text-lg font-semibold`.
- Condition tag (New / Like New / Good / Fair) as `subtle` badge.
- Heart icon for save — fills `--accent` when saved, animates `ease-spring`.
- Seller row: avatar + name + rating (star + number).
- Sold items: 60% opacity overlay + diagonal "SOLD" stamp.

### 8.3 Events

- Date block: 56×56 square, `--warning` bg (10% on light, full on dark), accent fg, month above day. Top-left of card.
- "Live now" pulsing dot in `--destructive` for events happening now.
- RSVP button states: `Going` (filled), `Maybe` (outline), `Going (X)` shows attendee count when self-rsvp'd.
- Attendee stack: 3 avatars + `+N going`.
- Map preview optional, `radius-lg`, 120px tall.

### 8.4 Lost & Found

- Two top-level tabs: `Lost` | `Found`.
- Status tag is the loudest element on the card — `solid` `--success` for Found, `solid` `--warning` for Lost.
- Location: pin icon + place name (e.g. "Library, 2nd floor").
- Time: relative ("2h ago"), absolute on hover.
- Photo required for Found posts, optional for Lost.
- "Claim" / "I found this" button as `primary`. After claim, opens DM thread auto-prefilled.

---

## 9. Iconography

- **Library**: `lucide-react`. No mixing libraries.
- **Sizes**: 16 (inline / inputs), 20 (default), 24 (nav, headers).
- **Stroke width**: 2 (default). Never change it per-icon.
- **Outline by default**, filled only for active states (e.g. active nav item, saved heart).
- Custom icons must match Lucide's grid (24×24, 2px stroke, rounded caps) — design or hire, don't grab from random sets.

---

## 10. Imagery

### 10.1 Photography

- All user-uploaded images displayed at consistent aspect ratios per context (1:1 marketplace, 16:9 events, 4:3 lost & found).
- Always `radius-lg` minimum, `object-cover`.
- Subtle ring (`1px --border` on light, inset `--white/5%` on dark) to separate from card bg.
- Lazy-load all but the first viewport's worth.

### 10.2 Illustrations

- Style: flat with one accent gradient. Geometric, slightly playful.
- Color: use only theme tokens — never bake hex into SVGs. Use `currentColor` and CSS vars.
- Empty states, onboarding, achievement moments only.

### 10.3 Mascot (future)

Placeholder: a small geometric campus building character. To be designed in V2.

---

## 11. Accessibility

- **Contrast**: All token pairs verified WCAG AA (4.5:1 text, 3:1 UI). Body text targets AAA (7:1) where feasible.
- **Focus ring**: 2px `--ring`, offset 2px from element. Never remove. `:focus-visible` only — no rings on mouse click.
- **Touch targets**: ≥ 44×44px. If visual element is smaller, expand hit area with padding.
- **Labels**: Every input has a visible `<label>` or `aria-label`. Icon-only buttons require `aria-label`.
- **Live regions**: Toasts use `role="status"`, errors use `role="alert"`.
- **Keyboard**: Every interactive element reachable via Tab. Modals trap focus. `Esc` closes overlays.
- **Reduced motion**: Respect `prefers-reduced-motion: reduce` — disable parallax, confetti, slide-ins; keep fades.
- **Color independence**: Never communicate state with color alone — pair with icon or text (e.g. "Found" tag has check icon, not just green).

---

## 12. Layout & Responsive

### 12.1 Breakpoints

| Name | Min width | Target |
|---|---|---|
| `sm` | 640 | Large phone landscape |
| `md` | 768 | Tablet portrait |
| `lg` | 1024 | Tablet landscape / small laptop |
| `xl` | 1280 | Desktop |
| `2xl` | 1536 | Large desktop |

Default styles target **375px mobile**. Add complexity at breakpoints up.

### 12.2 Grid

- Mobile: single column, `px-4`.
- Tablet (`md`): 2 columns where applicable, `px-6`, `gap-4`.
- Desktop (`lg`): up to 12-column CSS grid for app shell (sidebar + main + aside).
- Max content width: `max-w-6xl mx-auto` for marketing, `max-w-2xl` for reading flows.

### 12.3 Safe Areas

Always respect `env(safe-area-inset-*)` on the bottom nav and FAB. Add `pb-[env(safe-area-inset-bottom)]` to bottom-fixed elements.

---

## 13. Implementation Notes

### 13.1 Where Tokens Live

`src/styles.css` — defines `:root` and `.dark` variables, plus `@theme inline` mapping for Tailwind v4. **No other file** defines colors.

### 13.2 ThemeProvider Sketch

```tsx
// src/components/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
const Ctx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>(null!);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('campushub:theme') as Theme) ?? 'system'
  );

  useEffect(() => {
    const apply = () => {
      const resolved = theme === 'system'
        ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };
    apply();
    localStorage.setItem('campushub:theme', theme);

    if (theme === 'system') {
      const mq = matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
```

Mount once at the root (`__root.tsx`).

### 13.3 Tailwind v4 Usage

```tsx
// ✅ semantic tokens
<button className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
  Send
</button>

// ❌ never
<button className="bg-indigo-600 text-white">Send</button>
<button className="dark:bg-purple-600 dark:text-white">Send</button>
```

### 13.4 shadcn Variant Override (Hero Button)

```ts
// src/components/ui/button.tsx — add to cva variants
hero: 'bg-gradient-to-br from-primary to-accent text-primary-foreground ' +
      'shadow-md hover:shadow-lg dark:shadow-glow ' +
      'transition-all duration-200 ease-out hover:-translate-y-0.5',
```

```tsx
<Button variant="hero" size="lg">Join the campus</Button>
```

### 13.5 Adding a New Color Token

1. Add `--my-token: oklch(...)` to both `:root` and `.dark` in `src/styles.css`.
2. Register `--color-my-token: var(--my-token)` inside `@theme inline`.
3. Use as `bg-my-token`, `text-my-token`, etc.

---

## 14. Do's & Don'ts

### ✅ Do

- Use semantic tokens (`bg-primary`, not `bg-purple-600`).
- Define new variants on shadcn components instead of overriding with `className`.
- Test every screen in **both** themes before merging.
- Include focus-visible rings everywhere.
- Animate purposefully — every motion should communicate state.
- Write microcopy that sounds like a human friend.

### ❌ Don't

- Hardcode hex values in components.
- Use `text-white`, `bg-black` — use `text-primary-foreground`, `bg-foreground`.
- Stack two primary CTAs side by side.
- Apply purple gradients on white backgrounds (overused AI cliché).
- Use Inter or Poppins as the display font (overused).
- Communicate state with color alone — always pair with icon or text.
- Animate critical paths beyond `duration-base`.
- Mix icon libraries.
- Disable focus rings.

---

## 15. Future / Out of Scope

The following are explicitly **not** part of v1 but may land later:

- **Y2K seasonal theme** — chrome, cyber-blue, magenta. April Fools / launch event.
- **Per-event theming** — Spring Fest takes over the app with custom accent for 24h.
- **Per-college skinning** — primary color tied to school colors when user verifies edu email.
- **High-contrast mode** — beyond AA, true AAA across the board.
- **Mascot illustrations** — empty states currently use icons; commission illustration pack.
- **Animated avatars** — Lottie support for premium users.
- **Sound design** — message send, RSVP confirm. Behind a setting.

---

*Last updated: launch v1. Owners: design + frontend. Questions → #design channel.*
