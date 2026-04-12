#!/bin/bash
# ============================================
# Neuronita EVF — VPS Deployment Script
# Run this on your VPS after initial setup
# ============================================

set -e

APP_DIR="/var/www/neuronita"
REPO_URL="YOUR_GITHUB_REPO_URL"
BRANCH="master"

echo "=== Neuronita EVF Deployment ==="

# Pull latest code
if [ -d "$APP_DIR" ]; then
  echo "Pulling latest code..."
  cd "$APP_DIR"
  git pull origin $BRANCH
else
  echo "Cloning repository..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# Install server dependencies
echo "Installing server dependencies..."
cd "$APP_DIR/server"
npm install --production

# Install client dependencies and build
echo "Building frontend..."
cd "$APP_DIR/client"
npm install
npx vite build

# Run database migrations
echo "Running migrations..."
cd "$APP_DIR/server"
npx knex migrate:latest --knexfile config/knexfile.js

# Restart PM2
echo "Restarting application..."
cd "$APP_DIR/server"
pm2 delete neuronita-evf 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "=== Deployment complete ==="
echo "App running at http://YOUR_VPS_IP:3000"
echo ""
