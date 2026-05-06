# Directory Structure

**Analysis Date:** 2026-05-06

## Layout

```
.
├── app/                  # Next.js App Router
│   ├── favicon.ico       # Favicon
│   ├── globals.css       # Global Tailwind styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
├── eslint.config.mjs     # ESLint configuration
├── migration.md          # Migration plan documentation
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration (inferred/planned)
└── tsconfig.json         # TypeScript configuration
```

## Key Locations

- **Pages:** `app/` directory
- **Styles:** `app/globals.css`
- **Config:** Root directory config files (`next.config.ts`, `tsconfig.json`)

## Naming Conventions

- `PascalCase.tsx` for React components (planned)
- `kebab-case` for directories and most files
- `page.tsx` and `layout.tsx` for Next.js specific files

---

*Structure analysis: 2026-05-06*
*Update after major structure changes*
