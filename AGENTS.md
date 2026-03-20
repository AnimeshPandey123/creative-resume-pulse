# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 15 portfolio website (single service, no databases or external dependencies required for local development).

### Quick reference

- **Dev server**: `npm run dev` (port 3000)
- **Lint**: `npm run lint` (ESLint with `--max-warnings=0`)
- **Tests**: `npm test` (Jest + React Testing Library, 690 tests)
- **CI tests**: `npm run test:ci` (uses `jest.config.ci.js` with coverage thresholds)
- **Build**: `npx next build` (static export; use this instead of `npm run build` which also runs audit + lint)

See `package.json` scripts and `README.md` for full command reference.

### Non-obvious caveats

- The `next.config.ts` has `output: 'export'` (static export mode). API routes (e.g. `/api/contact`) do not work locally in dev mode; they are Vercel Edge Functions.
- `npm run build` chains `npm audit` + `npm lint` + `next build`. For a faster build-only check, use `npx next build` directly.
- Two RSS-related tests (`rss-generator.test.ts` and `route.simple.test.ts`) contain hardcoded copyright year assertions (e.g. "Copyright 2025") that will fail after December 31 of the hardcoded year. This is a known pre-existing issue.
- Husky pre-commit hook runs lint-staged, TypeScript type-check, and `test:ci`. Pre-push hook runs lint and `test:all`. These can be slow; be aware when committing.
- No `.nvmrc` or `.node-version` file exists. CI uses Node 18; Node 18+ works fine.
- Environment variables (`RESEND_API_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, etc.) are only needed for contact form and analytics features, not for core dev/test.
