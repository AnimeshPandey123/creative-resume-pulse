# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 15 portfolio/blog site** (single app, no monorepo). No databases, Docker, or external services are required for local development.

### Quick reference

| Task         | Command                   |
| ------------ | ------------------------- |
| Install deps | `npm install`             |
| Dev server   | `npm run dev` (port 3000) |
| Lint         | `npm run lint`            |
| Tests        | `npm test`                |
| CI tests     | `npm run test:ci`         |
| Build        | `npx next build`          |

All standard commands are documented in `README.md` under "Available Scripts".

### Non-obvious caveats

- **Static export mode**: `next.config.ts` sets `output: 'export'`, so the app builds as a fully static site. The `headers()` and `redirects()` in the config emit warnings during build but are harmless (they only apply when deployed behind a server like Vercel).
- **ESLint version**: The project uses ESLint 8 (not the flat-config-only ESLint 9). The config is in `eslint.config.mjs`. During `next build`, ESLint is intentionally skipped (`ignoreDuringBuilds: true`); run `npm run lint` separately.
- **Year-sensitive tests**: Two RSS/copyright tests in `src/lib/__tests__/rss-generator.test.ts` and `src/app/feed.xml/__tests__/route.simple.test.ts` hardcode the year "2025". These will fail in 2026+ without updating the expected year string. This is a pre-existing issue.
- **Husky hooks**: Pre-commit runs `lint-staged` + `tsc --noEmit` + `npm run test:ci`. Pre-push runs `npm run lint` + `npm run test:all`. These are defined in `.husky/`.
- **Environment variables**: Only `RESEND_API_KEY` and `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` are needed for the contact form (optional for dev). See `.env.example`. No env vars are required to start the dev server or run tests.
- **`npm run build` vs `npx next build`**: The `npm run build` script runs `npm audit` first, which may fail due to upstream vulnerabilities unrelated to the project code. Use `npx next build` to build without the audit step.
