#!/usr/bin/env bash
# ============================================================
# Neuronita EVF — standalone deploy on an AWS EC2 instance.
# Brings up app + Postgres + Caddy (automatic HTTPS). Caddy
# obtains the TLS cert for $DOMAIN once DNS points at this box.
# Usage: bash deploy-aws.sh [domain]   (default: neuronita.org)
# ============================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
INFRA="$REPO_DIR/infra/aws"
ENV_FILE="$INFRA/.env"
DOMAIN="${1:-neuronita.org}"

cd "$INFRA"

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
  echo "    Created. BACK THIS UP — it holds ENCRYPTION_KEY (PHI is unrecoverable without it)."
else
  echo "==> $ENV_FILE exists — keeping existing secrets."
fi

echo "==> Building and starting containers..."
docker compose up -d --build

echo "==> Waiting for the API..."
ok=0
for i in $(seq 1 50); do
  if docker compose exec -T evf-api node -e "require('http').get('http://localhost:3000/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))" >/dev/null 2>&1; then
    ok=1; break
  fi
  sleep 3
done

if [ "$ok" = "1" ]; then
  echo "==> API healthy. Seeding admin user (idempotent)..."
  docker compose exec -T evf-api sh -lc 'cd /app/server && node_modules/.bin/knex seed:run --specific=001_create_admin_user.js --knexfile config/knexfile.js' || true
else
  echo "WARNING: API not healthy yet. Check: docker compose logs -f evf-api"
fi

echo ""
echo "==================================================================="
echo " Neuronita EVF deployed on EC2."
echo "   Will be live at:  https://$DOMAIN"
echo "                     (Caddy issues TLS automatically once $DOMAIN"
echo "                      resolves to this server's public IP)"
echo "   Admin login:      admin@neuronita.com / Neuronita2026!"
echo "   Logs:             cd $INFRA && docker compose logs -f"
echo "==================================================================="
