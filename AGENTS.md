# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Next.js 15 portfolio/blog site (static export) with TypeScript, Tailwind CSS, and Radix UI. No databases, Docker, or external backend services are required. All content is static (JSON + Markdown files).

### Running the dev server

```bash
npm run dev        # starts Next.js on http://localhost:3000
```

### Lint, test, build

Standard commands are documented in `package.json` scripts and `README.md`. Key ones:

- **Lint:** `npm run lint` (ESLint with `--max-warnings=0`)
- **Test:** `npm test` (Jest + React Testing Library)
- **Test CI:** `npm run test:ci` (Jest with coverage thresholds)
- **Build:** `npx next build` (static export to `out/`)

### Known issues

- Two RSS feed tests (`src/lib/__tests__/rss-generator.test.ts` and `src/app/feed.xml/__tests__/route.simple.test.ts`) contain a hardcoded copyright year assertion (`Copyright 2025`). These fail when the current year is not 2025. This is a pre-existing issue in the repo, not an environment problem.

### Git hooks (Husky)

- **pre-commit:** runs `lint-staged` (ESLint + Prettier on staged files), `tsc --noEmit`, and `npm run test:ci` (coverage thresholds: branches 80%, functions 85%, lines 85%, statements 85%). The pre-commit hook comment warns: never lower coverage thresholds — add more tests instead.
- **pre-push:** runs `npm run lint` and `npm run test:all`.

### Environment variables

Optional — the app runs fully without them. See `.env.example` for the template (`RESEND_API_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`). Copy to `.env.local` if needed.
