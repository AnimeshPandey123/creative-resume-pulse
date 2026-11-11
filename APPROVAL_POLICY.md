# Approval policy

This file is the repository approval policy for Cursor PR Routing & Approval. Discovery uses this exact filename, `APPROVAL_POLICY.md`, in a changed file's directory or any ancestor directory.

Bugbot Review Context is required for every pull request. Do not approve without a finished Bugbot review of the latest commit.

## Required signals

Approve only when all of the following are true:

1. Bugbot finished on the latest commit and reported no findings that need a person. An open Bugbot finding blocks approval. A missing, skipped, or unfinished Bugbot check also blocks approval.
2. GitHub CI is green on that same commit: `npm run lint`, `npm run test:ci`, and `npm run build`. A Next.js build that skips ESLint does not replace `npm run lint`.
3. Every changed path is inside the auto-approve scope below.
4. The diff adds no secrets, credentials, tokens, private keys, or `.env` values.

If Bugbot or a security review reports a finding that needs a person, request review and do not approve. If the risk is unclear, do not approve.

## Auto-approve scope

Approve only when the change is limited to low-risk portfolio content or presentation:

- Copy, styling, and layout in existing pages and components, with behavior unchanged.
- Blog and project markdown under `src/content/` that does not add raw HTML, scripts, iframes, or new `dangerouslySetInnerHTML` usage.
- Typo, alt-text, metadata, and link-text fixes that keep existing URLs and routes.
- Tests that add coverage and leave every existing assertion, lint rule, typecheck, audit, and CI gate in place.

## Always require a person

Request review and do not approve when a pull request changes any of the following:

- This policy, `.cursor/approval-policies/`, `.cursor/hooks.json`, `.cursor/hooks/`, `.husky/`, `.github/`, or `AGENTS.md`
- `package.json`, lockfiles, or dependency versions
- `next.config.ts`, `eslint.config.mjs`, `tsconfig*.json`, Jest config, `vercel.json`, or `serve.json`
- `api/contact.ts`, `src/components/Contact.tsx`, reCAPTCHA, Resend, analytics, Hotjar, or any `dangerouslySetInnerHTML`
- Environment files, secrets, response headers, redirects, or `output: 'export'`
- A test, lint rule, typecheck, build, audit, security control, or CI command that is removed, skipped, weakened, relocated, or replaced
- Workflow or permission changes, new third-party scripts, new remote image hosts, or new network calls

Copyright and RSS tests must keep using `new Date().getFullYear()` for the current year.

Static export stays on.

## Reviewer

When approval is blocked, request review from Animesh Pandey (`AnimeshPandey123`).

A pull request that adds or edits this file needs a person. Use the base-branch copy of this policy when one exists. Do not use a policy change in the same pull request to loosen review of that pull request.
