# Deploy Neuronita EVF on a shared VPS (behind existing Traefik)

This deploys the EVF app at **https://solodevs.net** on a VPS that already runs
other projects behind a **Traefik** reverse proxy (Docker provider). It runs the
app and its **own isolated Postgres** as containers, and joins the existing
Traefik network so Traefik routes `solodevs.net` to it. No other project is
modified; ports 80/443 stay owned by Traefik.

## Prerequisites (already true on this box)
- Docker + Docker Compose
- Traefik running with the Docker provider, on network `n8n_default`,
  cert resolver `mytlschallenge` (TLS-ALPN), entrypoints `web`/`websecure`
- DNS: `solodevs.net` → this server's public IP

## Deploy

```bash
# 1. Clone (or pull) the repo
git clone https://github.com/cooldev109/hipaa-wilfredo.git /opt/neuronita
cd /opt/neuronita

# 2. One command — builds the image, starts EVF + its Postgres,
#    runs migrations, seeds the admin user, and prints the result.
bash deploy-vps.sh
```

That's it. First load of `https://solodevs.net` may take ~30s while Traefik
obtains the TLS certificate.

**Admin login:** `admin@neuronita.com` / `Neuronita2026!` (must change on first login).

## How routing works
`infra/vps/docker-compose.yml` puts these Traefik labels on the `evf-api`
container; Traefik auto-discovers them:

```
traefik.enable=true
traefik.docker.network=n8n_default
traefik.http.routers.neuronita.rule=Host(`solodevs.net`)
traefik.http.routers.neuronita.entrypoints=web,websecure
traefik.http.routers.neuronita.tls=true
traefik.http.routers.neuronita.tls.certresolver=mytlschallenge
traefik.http.services.neuronita.loadbalancer.server.port=3000
```

## Secrets
`deploy-vps.sh` generates `infra/vps/.env` with random `JWT_*` and
`ENCRYPTION_KEY` (64 hex). **Back up this file.** If `ENCRYPTION_KEY` is lost
or changed, previously-encrypted patient data cannot be decrypted.

## Common operations
```bash
cd /opt/neuronita/infra/vps
docker compose logs -f evf-api      # logs
docker compose restart evf-api      # restart app
docker compose down                 # stop (data volumes persist)
docker compose up -d --build        # redeploy after a git pull
```

## Updating after new code
```bash
cd /opt/neuronita && git pull
cd infra/vps && docker compose up -d --build
# migrations run automatically on container start
```

## Notes / not yet production-hardened
- App↔Postgres traffic is inside the Docker network (no TLS); `DATABASE_SSL=false`.
- For full HIPAA at rest, use disk/volume encryption on the host or a managed
  encrypted Postgres (then set `DATABASE_SSL=true` and add `ssl` to the runtime
  pool in `server/config/database.js`).
- Generated PDFs persist in the `evf-storage` volume.
