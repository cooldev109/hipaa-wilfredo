#!/usr/bin/env bash
# ============================================================
# Neuronita EVF — standalone deploy on an AWS EC2 instance.
# App + Postgres + nginx (reverse proxy) + Certbot (auto-TLS).
# Safe to re-run: keeps an existing .env (and ENCRYPTION_KEY) and
# skips cert issuance if a certificate already exists.
# Usage: bash deploy-aws.sh [domain] [email]
# ============================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
INFRA="$REPO_DIR/infra/aws"
ENV_FILE="$INFRA/.env"
CONF="$INFRA/nginx/conf.d/app.conf"
DOMAIN="${1:-neuronita.org}"
EMAIL="${2:-clinicarehabilitacion10@gmail.com}"

cd "$INFRA"

# --- .env: generate only if missing (preserves ENCRYPTION_KEY on re-deploys) ---
if [ ! -f "$ENV_FILE" ]; then
  echo "==> Generating $ENV_FILE with fresh secrets..."
  gen() { openssl rand -hex 32; }
  cat > "$ENV_FILE" <<EOF
DATABASE_NAME=neuronita_evf
DATABASE_USER=neuronita
DATABASE_PASSWORD=$(gen)
DATABASE_SSL=false
JWT_ACCESS_SECRET=$(gen)
JWT_REFRESH_SECRET=$(gen)
ENCRYPTION_KEY=$(gen)
CORS_ORIGIN=https://$DOMAIN
DOMAIN=$DOMAIN
OPENAI_API_KEY=
EOF
  chmod 600 "$ENV_FILE"
  echo "    Created. BACK THIS UP — it holds ENCRYPTION_KEY."
else
  echo "==> Keeping existing $ENV_FILE."
fi

# --- Bootstrap: save the real HTTPS conf, start nginx with an HTTP-only conf
#     so it can boot without a certificate and serve the ACME challenge. ---
cp "$CONF" /tmp/app.conf.final
cat > "$CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 "ok"; add_header Content-Type text/plain; }
}
EOF

echo "==> Building and starting containers..."
docker compose up -d --build --remove-orphans

echo "==> Waiting for the API..."
for i in $(seq 1 50); do
  if docker compose exec -T evf-api node -e "require('http').get('http://localhost:3000/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))" >/dev/null 2>&1; then
    echo "    API healthy."; break
  fi
  sleep 3
done

echo "==> Seeding admin user (idempotent)..."
docker compose exec -T evf-api sh -lc 'cd /app/server && node_modules/.bin/knex seed:run --specific=001_create_admin_user.js --knexfile config/knexfile.js' || true

# --- Obtain certificate (skip if one already exists) ---
if docker compose run --rm --entrypoint sh certbot -c "[ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]"; then
  echo "==> Certificate already present — skipping issuance."
else
  echo "==> Requesting certificate via webroot..."
  docker compose run --rm --entrypoint certbot certbot certonly --webroot -w /var/www/certbot \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
fi

# --- Apply the real HTTPS config and reload ---
echo "==> Applying HTTPS config..."
cp /tmp/app.conf.final "$CONF"
docker compose exec -T nginx nginx -t
docker compose exec -T nginx nginx -s reload

echo ""
echo "==================================================================="
echo " Neuronita EVF (nginx + Certbot) deployed."
echo "   URL:          https://$DOMAIN"
echo "   Admin login:  admin@neuronita.com / Neuronita2026!"
echo "   Logs:         cd $INFRA && docker compose logs -f"
echo "==================================================================="
