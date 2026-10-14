# Deploying TCI AI Landing (Docker)

The site runs as a single container: the Next.js standalone server on port 3000 inside the container. It needs a Node server because it uses the TH/EN middleware and refreshes stats hourly (ISR), so it can't be uploaded as static files.

## 1. Set the environment

```bash
cp .env.example .env
```

| Variable | When it applies | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **build time** | Real domain, e.g. `https://ai.example.org`; used for canonical, hreflang and OpenGraph |
| `NEXT_PUBLIC_WORKSPACE_URL` | **build time** | Agentic Workspace URL. Leave empty and the Submit button stays disabled |
| `THAIJO_STATS_URL` | runtime | ThaiJO stats endpoint. Leave empty to use the October 2026 figures |
| `PORT` | runtime (compose) | Host port to publish (default `8080`) |

> `NEXT_PUBLIC_*` values are baked into the bundle at build time. After changing them, run `--build` again.

## 2. Build and run

```bash
docker compose up -d --build      # build the image and start the container
docker compose ps                 # wait until the status is healthy
curl -I http://localhost:8080/th  # should return 200
```

Update after a code change: `git pull && docker compose up -d --build`
Logs: `docker compose logs -f web`

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

4. Open only ports 80/443 in the firewall. Bind the container's port to localhost only by changing compose to `"127.0.0.1:${PORT:-8080}:3000"`.

## About the image

- Multi-stage build on `node:24-alpine`; the final stage contains only `.next/standalone` and static files
- Runs as a non-root user (`nextjs`, uid 1001), with `no-new-privileges` and `cap_drop: ALL`
- The `HEALTHCHECK` calls `/th` every 30 seconds
- Lint doesn't run during the image build (run `npm run check` in CI before deploying), but type-checking still runs
