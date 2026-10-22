#!/bin/sh
set -e

echo "=========================================================="
echo " Starting MIDI Portal Backend (Express + Socket.IO)"
echo " Environment: ${NODE_ENV:-production}"
echo " Host Port: ${PORT:-4000} | Socket Port: ${SOCKET_PORT:-5000}"
echo "=========================================================="

# 1. Wait for PostgreSQL to be ready
if [ -n "$DB_HOST" ]; then
  echo "[backend] Checking database connection at $DB_HOST:${DB_PORT:-5432}..."
  MAX_TRIES=30
  TRIES=0
  until node -e "
    const net = require('net');
    const client = net.createConnection({ host: '$DB_HOST', port: ${DB_PORT:-5432} }, () => {
      client.end();
      process.exit(0);
    });
    client.on('error', () => process.exit(1));
  " 2>/dev/null; do
    TRIES=$((TRIES + 1))
    if [ "$TRIES" -ge "$MAX_TRIES" ]; then
      echo "[backend] ERROR: Database $DB_HOST:${DB_PORT:-5432} was not reachable after $MAX_TRIES attempts!" >&2
      exit 1
    fi
    echo "[backend] Database not ready yet (attempt $TRIES/$MAX_TRIES)... waiting 2s"
    sleep 2
  done
  echo "[backend] Database is reachable and accepting connections."
fi

# 2. Run Sequelize database migrations
echo "[backend] Executing database migrations..."
if ! npx sequelize-cli db:migrate; then
  echo "[backend] FATAL: Database migrations failed! Check logs and database connection." >&2
  exit 1
fi
echo "[backend] Database migrations verified/applied successfully."

# 3. Apply safe, idempotent production seeders (each checks for existing rows before inserting)
echo "[backend] Checking idempotent production seeders..."
for SEEDER in \
  20260622130000-seed-production-permissions.js \
  20260914100000-standardize-admin-permissions.js \
  20261018210500-seed-publication-permissions.js \
  20261018211000-seed-publication-categories.js
do
  if ! npx sequelize-cli db:seed --seed "$SEEDER"; then
    echo "[backend] FATAL: Seeder $SEEDER failed! Check the output above." >&2
    exit 1
  fi
done
echo "[backend] Production seeders applied successfully."

# 4. Start the application
echo "[backend] Starting Node.js server..."
exec npm start
