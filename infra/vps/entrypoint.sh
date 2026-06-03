#!/bin/sh
set -e

cd /app/server

echo "[entrypoint] Running database migrations..."
node_modules/.bin/knex migrate:latest --knexfile config/knexfile.js

echo "[entrypoint] Starting Neuronita EVF server..."
exec node index.js
