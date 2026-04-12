# VPS Deployment Guide — Neuronita EVF (Test/Demo)

This guide deploys the app on a single VPS for client demo purposes.
**Not for production** — production requires AWS with HIPAA compliance (Phase 6).

---

## Requirements

- VPS with Ubuntu 22.04+ (1GB RAM minimum, 2GB recommended)
- Root or sudo access
- A GitHub repo with the project code (private)

---

## Step 1: VPS Initial Setup

SSH into your VPS:

```bash
ssh root@YOUR_VPS_IP
```

Update system:

```bash
apt update && apt upgrade -y
```

---

## Step 2: Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node -v  # Should show v20.x
npm -v
```

---

## Step 3: Install PostgreSQL

```bash
apt install -y postgresql postgresql-contrib
```

Start and enable PostgreSQL:

```bash
systemctl start postgresql
systemctl enable postgresql
```

Create database and user:

```bash
sudo -u postgres psql
```

Inside PostgreSQL:

```sql
CREATE DATABASE neuronita_evf;
ALTER USER postgres PASSWORD 'your_strong_password_here';
\q
```

---

## Step 4: Install PM2

```bash
npm install -g pm2
```

---

## Step 5: Install Chromium (for Puppeteer PDF generation)

```bash
apt install -y chromium-browser
```

Or if using newer Ubuntu:

```bash
apt install -y chromium
```

Set the Puppeteer env variable:

```bash
export PUPPETEER_EXECUTABLE_PATH=$(which chromium-browser || which chromium)
```

---

## Step 6: Clone the Project

```bash
mkdir -p /var/www
cd /var/www
git clone YOUR_GITHUB_REPO_URL neuronita
cd neuronita
```

---

## Step 7: Configure Environment

```bash
cd /var/www/neuronita/server
cp .env.example .env
nano .env
```

Edit the `.env` file:

```env
NODE_ENV=production
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=neuronita_evf
DATABASE_USER=postgres
DATABASE_PASSWORD=your_strong_password_here

# Generate these with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET=paste_generated_hex_here
JWT_REFRESH_SECRET=paste_another_generated_hex_here
ENCRYPTION_KEY=paste_another_generated_hex_here

CORS_ORIGIN=http://YOUR_VPS_IP:3000
STORAGE_PATH=./storage/reports
```

Generate the secrets:

```bash
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 8: Install Dependencies

```bash
# Server
cd /var/www/neuronita/server
npm install --production

# Client
cd /var/www/neuronita/client
npm install
```

---

## Step 9: Build Frontend

```bash
cd /var/www/neuronita/client
npx vite build
```

This creates `client/dist/` folder with the production React build.

---

## Step 10: Run Database Migrations + Seed

```bash
cd /var/www/neuronita/server
npx knex migrate:latest --knexfile config/knexfile.js
npx knex seed:run --knexfile config/knexfile.js
```

---

## Step 11: Create Storage Directory

```bash
mkdir -p /var/www/neuronita/server/storage/reports
```

---

## Step 12: Start with PM2

```bash
cd /var/www/neuronita/server
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions it prints
```

Check it's running:

```bash
pm2 status
pm2 logs neuronita-evf
```

---

## Step 13: Configure Firewall

```bash
ufw allow 22      # SSH
ufw allow 3000    # App
ufw enable
```

---

## Step 14: Test

Open in browser:

```
http://YOUR_VPS_IP:3000
```

Login:

```
Email: admin@neuronita.com
Password: Neuronita2026!
```

(You'll be asked to change the password on first login)

---

## Optional: Nginx Reverse Proxy (port 80)

If you want to access the app on port 80 instead of 3000:

```bash
apt install -y nginx
```

Create nginx config:

```bash
nano /etc/nginx/sites-available/neuronita
```

```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }
}
```

Enable and restart:

```bash
ln -s /etc/nginx/sites-available/neuronita /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
ufw allow 80
```

Now access at: `http://YOUR_VPS_IP`

---

## Updating the App

After pushing new code to GitHub:

```bash
cd /var/www/neuronita
git pull
cd client && npm install && npx vite build
cd ../server && npm install
npx knex migrate:latest --knexfile config/knexfile.js
pm2 restart neuronita-evf
```

---

## Troubleshooting

**App won't start:**
```bash
pm2 logs neuronita-evf --lines 50
```

**Database connection error:**
```bash
sudo -u postgres psql -c "SELECT 1;"
```

**Puppeteer/PDF error:**
```bash
which chromium-browser || which chromium
# Set in .env or environment:
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Check if port 3000 is in use:**
```bash
lsof -i :3000
```
