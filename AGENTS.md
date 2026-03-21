# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 15 static portfolio site** (React 18 + TypeScript + Tailwind CSS). No databases, Docker, or external services are required for local development.

### Quick reference

- **Package manager:** npm (lockfile: `package-lock.json`)
- **Dev server:** `npm run dev` (serves on `localhost:3000`)
- **Lint:** `npm run lint` (ESLint, zero warnings policy via `--max-warnings=0`)
- **Tests:** `npm test` (Jest + React Testing Library)
- **CI tests:** `npm run test:ci` (uses `jest.config.ci.js` with coverage thresholds)
- **Build:** `npm run build` (runs audit + lint + `next build`)

All available scripts are documented in `package.json` and the `README.md` "Available Scripts" section.

### Non-obvious notes

- The default `next.config.ts` uses `output: 'export'` (static export). The dev server (`npm run dev`) still works normally with hot reloading, but API routes (e.g. the contact form endpoint at `api/contact.ts`) are not functional in static export mode.
- Two RSS feed tests (`src/lib/__tests__/rss-generator.test.ts` and `src/app/feed.xml/__tests__/route.simple.test.ts`) hardcode the copyright year as "2025". These will fail when the current year is not 2025 — this is a pre-existing issue, not an environment problem.
- Husky pre-commit hook runs lint-staged, TypeScript type-checking (`tsc --noEmit`), and `npm run test:ci`. Pre-push hook runs `npm run lint` and `npm run test:all`. These are enforced by `.husky/pre-commit` and `.husky/pre-push`.
- Environment variables (`.env.local`) are optional for core development. The app runs without `RESEND_API_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, etc. — those only affect the contact form and analytics.
- `npm audit` warnings about deprecated packages (e.g. `eslint@8`) are expected and do not block development.
