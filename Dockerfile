# syntax=docker/dockerfile:1.7
# TCI AI landing page: production image (Next.js standalone server).
#
#   docker compose up -d --build            # recommended, see docker-compose.yml
#   docker build -t tci-ai-landing \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://example.org .
#
# NEXT_PUBLIC_* values are inlined into the bundle, so they are BUILD args.
# NEXT_PUBLIC_SITE_URL is required: the build stops without it, so canonical,
# hreflang and og:url can never ship pointing at localhost by accident.
# THAIJO_STATS_URL is read by the server at runtime.

ARG NODE_IMAGE=node:24-alpine

# ---- 1. dependencies (cached until package*.json change) ----
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- 2. build ----
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WORKSPACE_URL=
RUN test -n "$NEXT_PUBLIC_SITE_URL" || { echo "NEXT_PUBLIC_SITE_URL is required, e.g. https://ai.example.org (http://localhost:8080 for a local test)"; exit 1; }
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_WORKSPACE_URL=${NEXT_PUBLIC_WORKSPACE_URL} \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Lint runs in CI (npm run check); the image build still type-checks.
RUN npx next build --no-lint

# ---- 3. runtime: only the standalone server, as a non-root user ----
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/th || exit 1
CMD ["node", "server.js"]
