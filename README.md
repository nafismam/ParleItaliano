# Parle Italiano

A focused Italian grammar workspace: 37 lessons, eight learning paths, and 185 exercises. Explore the roadmap, read interactive notes, practice four exercise types, save lessons, and see your real mastery, XP, and streaks. The dark interface combines Plus Jakarta Sans, original typographic artwork, Framer Motion, Radix dialogs, and Lenis; reduced-motion and keyboard alternatives are supported.

The GitHub Pages edition grades locally and saves progress in the browser. The full Next.js application supports email/Google authentication, cached MongoDB lessons, server grading, and transactional account progress. Bookmarks and daily goals are device preferences in both editions.

## Quick start

Requirements: Node **24 LTS**, npm, Docker with Compose. Node 20 is end-of-life; the runtime, CI, and Dockerfile use Node 24.

```sh
npm ci
npm run configure:local
docker compose up -d --wait mongo redis
npm run db:indexes
npm run seed
npm run dev
```

Run a local request to `/api/health` on port 3000. It returns `200` only when MongoDB and Redis respond. Account registration, sign-in, the protected account page, and sign-out work locally. Google appears only when its OAuth credentials are configured.

`configure:local` creates ignored `.env` and `apps/web/.env.local` files, generates a local random `AUTH_SECRET`, and preserves existing files. These files are for local development only. If you edit one, keep the app and Compose configurations consistent. Secrets are never committed.

For the local production bundle, run `npm run build && npm start`. The start helper copies public/static assets into the standalone bundle and propagates its exit status.

For the standalone container, prepare services and indexes as above, then run:

```sh
docker compose up -d --build --wait app
```

MongoDB is a single-node replica set so transaction behavior matches Atlas development workflows. MongoDB and Redis have durable local volumes and bind only to loopback on the host. This Compose stack has no database authentication and is **for local development only**. Public deployments must use authenticated private services or Atlas and Upstash.

## Workspace layout

```text
apps/web          Next.js server app, auth, account pages, API routes, CSP
apps/preview      Separate static Next.js export for GitHub Pages
packages/contracts Zod contracts, exercise validation, safe public exercise projection
packages/content   Trusted editorial lessons and browser-safe roadmap
packages/database  Pooled Mongoose connection and indexed models
packages/platform  Runtime environment validation, Redis limiter, structured logging
packages/ui        Shared learning workspace, notes, exercises, motion, and local state
scripts            Local configuration, seed/index migrations, static preview server
tests              Contracts, grading/concurrency, auth, and desktop/mobile learning flows
docs               Architecture and deployment decisions
```

Seed the curated lessons after MongoDB is healthy with `npm run seed`. Seeding is repeatable, preserves each topic’s database identity and exercise IDs, and never deletes user progress.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run test:integration
npx playwright install --with-deps chromium
npm run test:e2e
npm run test:preview
npm run build
NEXT_PUBLIC_BASE_PATH=/ParleItaliano npm run build:preview
docker build -t parle-italiano:local .
```

Integration tests require the services above. They create uniquely identified test documents and clean up their own records. Browser tests exercise registration, sessions, grading, and complete learning flows against a production build at port 3100, with a unique rate-limit namespace per run. `test:preview` builds the real `/ParleItaliano` static export and tests learning flows on port 4300. Set `E2E_BASE_URL` only to an explicitly designated local test server to test an existing build instead. Set `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium` to use an existing system browser in constrained environments. `PLAYWRIGHT_BROWSERS_PATH` and `BUILDX_CONFIG` can point to writable directories if the home directory is read-only. CI downloads the matching Playwright browser.

## Deploy and preview

See [deployment instructions](docs/deployment.md). `pages.yml` builds and deploys **only the static frontend preview**. `ci-cd.yml` runs lint, strict type checking, unit tests, service integration tests, Chromium browser tests, both Next.js builds, and the Docker image build. GitHub Actions orchestrates deployment; GitHub Pages hosts the static files. The authenticated application needs a Node/container host.

Auth.js v5 is pinned to `5.0.0-beta.32`; its prerelease status is an explicit dependency risk. Review upstream security updates before a public launch. Password registration is implemented; email verification, password recovery, account deletion, and privacy/retention policies are required product follow-up before opening public self-service registration.

See [architecture](docs/architecture.md), [curriculum](docs/curriculum.md), [content notes](docs/content-authoring.md), and [deployment instructions](docs/deployment.md).
