# Deployment

## GitHub Pages frontend preview

The `GitHub Pages frontend preview` workflow runs on pushes to `main` or manual dispatch. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. GitHub Pages availability depends on repository visibility and the account's plan. The workflow sets the repository base path, exports `apps/preview/out`, uploads it, and deploys through the `github-pages` environment. Use the URL returned by the successful deployment; a workflow file alone does not establish that a site is live.

The static edition includes the complete shared interface: roadmap, notes, practice, bookmarks, goals, XP, and progress. It saves on the current browser/device and identifies this storage mode. Hash navigation supports lesson links, reloads, and back/forward on Pages. Educational answer keys are intentionally included for local grading; this edition must not be used for secure assessments. Pages cannot run Auth.js, API routes, MongoDB, or Redis. No OAuth/database secret belongs in the Pages workflow or a `NEXT_PUBLIC_*` variable.

`npm run test:preview` builds and tests the actual repository base path before release. The expected URL for this repository is `https://nafismam.github.io/ParleItaliano/`; verify the deployment URL and public HTTP response after publication.

## Full server deployment

Use a container-capable host, or a Next.js Node host that supports the App Router. `Dockerfile` uses dependency, builder, and non-root standalone runner stages. It builds without database or OAuth secrets. Bind port 3000 behind an HTTPS ingress.

Required runtime settings:

| Setting                                              | Purpose                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `APP_ORIGIN`                                         | Exact public HTTPS origin without trailing slash                   |
| `AUTH_URL`                                           | Same origin; pins callback origin                                  |
| `AUTH_SECRET`                                        | Random secret of at least 32 characters from a secure secret store |
| `MONGODB_URI`                                        | Authenticated Atlas/replica-set connection string                  |
| `REDIS_URL`                                          | Authenticated Redis TLS URL, or omit when using Upstash REST       |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Both required when choosing Upstash REST                           |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`               | Optional pair enabling Google sign-in                              |
| `TRUST_PROXY`                                        | `true` only with an ingress that replaces forwarded client IPs     |

Configure Google's authorized redirect URI as `https://YOUR_HOST/api/auth/callback/google`. Do not enable automatic account linking. Supply secrets securely in host settings, never in source or chat. Run `npm run db:indexes` and `npm run seed` with production database access as a one-off migration before rollout. Public lesson JSON is cached for five minutes; allow that window after editorial refreshes. The production image intentionally has no migration tooling.

Use `/api/health` as a dependency readiness probe; it returns `503` if configuration, MongoDB, or Redis is unavailable, with no connection-string leakage. Restrict public probe exposure at the ingress if desired. Collect JSON stdout logs and alert on error status and latency. Load tests, real Google OAuth verification, managed-service connectivity, backup/restore drills, and production capacity measurements have not been performed by the local test suite.

## Cloud workspace

Use the existing `/workspace/ParleItaliano` checkout; cloud tasks are already isolated and do not need another Git worktree. Local generated credentials are ignored. Retained dependency files/images differ from running processes: after a new task starts, start MongoDB/Redis again, run index checks and the repeatable seed, and launch the server. Saved cloud setup/start instructions do not publish the cloud environment or deploy GitHub Pages.

## TLS-intercepting build environments

If your trusted build network uses an additional CA, the Dockerfile accepts an optional BuildKit secret. Supply the platform-provided public CA file; verification remains enabled and the file is not copied into image layers:

```sh
BUILDX_CONFIG=/tmp/parle-buildx docker build \
  --secret id=build_ca,src="$NODE_EXTRA_CA_CERTS" \
  -t parle-italiano:local .
```

Normal GitHub-hosted builds need no extra CA. Never disable npm strict SSL or TLS verification to bypass a certificate error.
