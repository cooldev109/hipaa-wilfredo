#!/usr/bin/env bash
# ============================================================
# Neuronita EVF — deploy alongside the existing Traefik stack.
# Safe by design: only creates its own containers/volumes and
# joins the existing Traefik network (n8n_default). It does NOT
# modify n8n / veinticuatro / saas or touch ports 80/443.
# ============================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
INFRA="$REPO_DIR/infra/vps"
ENV_FILE="$INFRA/.env"
DOMAIN="solodevs.net"
PROXY_NET="n8n_default"

cd "$INFRA"

echo "==> Checking Traefik network '$PROXY_NET' exists..."
if ! docker network inspect "$PROXY_NET" >/dev/null 2>&1; then
  echo "ERROR: docker network '$PROXY_NET' not found. Available networks:"
  docker network ls
  echo "Set PROXY_NET in this script to Traefik's network and re-run."
  exit 1
fi

# --- Generate .env with strong secrets on first run ---
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
OPENAI_API_KEY=
EOF
  chmod 600 "$ENV_FILE"
  echo "    Created. BACK THIS FILE UP — it holds ENCRYPTION_KEY (PHI is"
  echo "    unrecoverable if it is lost)."
else
  echo "==> $ENV_FILE already exists — keeping existing secrets."
fi

echo "==> Building and starting EVF containers..."
docker compose up -d --build

# --- Wait for the API to report healthy, then seed the admin user ---
echo "==> Waiting for the API to come up (migrations run on first boot)..."
ok=0
for i in $(seq 1 40); do
  if docker compose exec -T evf-api node -e "require('http').get('http://localhost:3000/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))" >/dev/null 2>&1; then
    ok=1; break
  fi
  sleep 3
done

if [ "$ok" = "1" ]; then
  echo "==> API healthy. Seeding admin user (idempotent)..."
  docker compose exec -T evf-api sh -lc 'cd /app/server && node_modules/.bin/knex seed:run --specific=001_create_admin_user.js --knexfile config/knexfile.js' || true
else
  echo "WARNING: API did not become healthy in time. Check: docker compose logs -f evf-api"
fi

echo ""
echo "==================================================================="
echo " Neuronita EVF deployed."
echo "   URL:          https://$DOMAIN"
echo "                 (first request may take ~30s while Traefik issues TLS)"
echo "   Admin login:  admin@neuronita.com  /  Neuronita2026!"
echo "                 (you must change the password on first login)"
echo "   Logs:         cd $INFRA && docker compose logs -f evf-api"
echo "   Stop:         cd $INFRA && docker compose down"
echo "==================================================================="
