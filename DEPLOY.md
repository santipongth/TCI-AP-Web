# Deploying TCI AI Landing (Docker)

The site runs as a single container: the Next.js standalone server on port 3000 inside the container. It needs a Node server because it uses the TH/EN middleware and refreshes stats hourly (ISR), so it can't be uploaded as static files.

## 1. Set the environment

```bash
cp .env.example .env
```

| Variable | When it applies | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **build time, required** | Public origin, e.g. `https://ai.example.org`; used for canonical, hreflang, OpenGraph, `robots.txt` and `sitemap.xml`. The build stops if it is empty |
| `NEXT_PUBLIC_WORKSPACE_URL` | **build time** | Agentic Workspace URL. Leave empty and the Submit button stays disabled; the nav CTA scrolls to the top |
| `THAIJO_STATS_URL` | runtime | ThaiJO stats endpoint. Leave empty to use the October 2026 figures. Failures are logged as `[stats] …` and fall back to those figures |
| `PORT` | runtime (compose) | Host port, published on `127.0.0.1` only (default `8080`) |

> `NEXT_PUBLIC_*` values are baked into the bundle at build time. After changing them, run `--build` again.

## 2. Build and run

```bash
docker compose up -d --build      # build the image and start the container
docker compose ps                 # wait until the status is healthy
curl -I http://127.0.0.1:8080/th  # should return 200 with the security headers below
```

For a quick local test without a real domain: `NEXT_PUBLIC_SITE_URL=http://localhost:8080 docker compose up -d --build`.

Update after a code change: `git pull && docker compose up -d --build`
Logs: `docker compose logs -f web` (rotated at 10 MB × 3 files)

## 3. On a cloud server (VM)

1. Install Docker Engine and the Compose plugin.
2. Clone the repo, create `.env` (set `NEXT_PUBLIC_SITE_URL` to the real domain), then run `docker compose up -d --build`.
3. Put a reverse proxy with TLS in front. Example Caddy config (issues certificates automatically):

   ```caddyfile
   ai.example.org {
     encode zstd gzip
     reverse_proxy 127.0.0.1:8080
   }
   ```

4. Open only ports 80/443 in the firewall. Compose already publishes the container on `127.0.0.1` only; Docker-published ports bypass host firewalls such as ufw, so keep it that way.

## Security headers

The app sets these on every response (`next.config.ts`), so the proxy does not need to:

- `Strict-Transport-Security: max-age=63072000` (ignored by browsers over plain HTTP)
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` that turns off camera, microphone, geolocation and topics
- `Content-Security-Policy` (production only): first-party sources only, `frame-ancestors 'none'`, and `form-action` that also allows the Workspace origin. Scripts need `'unsafe-inline'` because the pages are static and Next inlines its RSC payload; nonces would require dynamic rendering.

If you add a third-party script (analytics, chat widget), extend the CSP in `next.config.ts` and add a PDPA consent notice.

## About the image

- Multi-stage build on `node:24-alpine`; the final stage contains only `.next/standalone` and static files
- Runs as a non-root user (`nextjs`, uid 1001), with `no-new-privileges` and `cap_drop: ALL`
- The `HEALTHCHECK` calls `/th` every 30 seconds
- Lint doesn't run during the image build; GitHub Actions runs `npm run check` (lint, types, tests, build) on every push and pull request
- `next/font` downloads the IBM Plex fonts at build time, so the build host needs internet access

## Known issue: postcss advisory

`npm audit --omit=dev` reports GHSA-6g55-p6wh-862q / GHSA-r28c-9q8g-f849 (high) and GHSA-qx2v-qp2m-jg93 / GHSA-fxqj-rqcc-2cmp (moderate) in the `postcss@8.4.31` that `next@15` bundles. PostCSS only processes this repo's own CSS at build time and never sees user input, so the issue is not reachable in this deployment. The fix is the Next 16 upgrade; until then this risk is accepted.
