# ---- Neuronita EVF — production image ----
# Stage 1: build the React frontend (Vite) into client/dist
FROM node:20-bookworm-slim AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
# Uses client/.env.production (VITE_API_URL=/api) — same-origin behind Traefik
RUN npm run build

# Stage 2: runtime (Node + Chromium for Puppeteer PDF generation)
FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Chromium + fonts for headless PDF rendering. Installing the chromium package
# pulls in all required shared libraries automatically.
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      fonts-liberation \
      fonts-noto-color-emoji \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# Backend source + migrations/seeds (knexfile resolves ../../database)
COPY server/ ./
COPY database/ /app/database/

# Built frontend (app.js serves ../client/dist when NODE_ENV=production)
COPY --from=client-build /app/client/dist /app/client/dist

# Storage for generated PDFs (mounted as a volume in compose)
RUN mkdir -p /app/server/storage/reports

COPY infra/vps/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]
