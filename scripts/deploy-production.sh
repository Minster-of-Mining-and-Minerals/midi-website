#!/usr/bin/env bash
# Production deploy after git pull on the server.
# Imports upgraded DB + reprocessed uploads, then rebuilds containers.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Load only DB_* vars — do not source full .env (may contain unquoted spaces / JS lines)
load_db_env() {
  local file="$1"
  local line key val
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%%#*}"
    line="$(echo "$line" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    [ -z "$line" ] && continue
    case "$line" in
      DB_USER=*|DB_PASSWORD=*|DB_NAME=*)
        key="${line%%=*}"
        val="${line#*=}"
        val="${val%\"}"; val="${val#\"}"
        val="${val%\'}"; val="${val#\'}"
        export "$key=$val"
        ;;
    esac
  done < "$file"
}

if [ -f .env ]; then
  load_db_env .env
elif [ -f backend/.env ]; then
  load_db_env backend/.env
fi

DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-root}"
DB_NAME="${DB_NAME:-jarra_holding_group_website}"

SNAPSHOT="$REPO_ROOT/backend/db-snapshot.sql"
UPLOADS_ARCHIVE="$REPO_ROOT/backend/deploy-uploads.tar.gz"

if [ ! -f "$SNAPSHOT" ]; then
  echo "Missing $SNAPSHOT"
  exit 1
fi

if [ ! -f "$UPLOADS_ARCHIVE" ]; then
  echo "Missing $UPLOADS_ARCHIVE"
  exit 1
fi

BACKUP_DIR="$REPO_ROOT/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "=== Mineral Industry Development Institute (MIDI) Portal production deploy ==="

if docker ps --format '{{.Names}}' | grep -q '^jarra-holding-group-website-db$'; then
  echo "1. Backing up current database..."
  docker exec -e "PGPASSWORD=$DB_PASSWORD" jarra-holding-group-website-db \
    pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner --no-acl \
    > "$BACKUP_DIR/pre-deploy.sql" || true
else
  echo "1. No running DB container — skipping backup"
fi

echo "2. Starting database..."
docker compose up -d db
echo "   Waiting for Postgres..."
sleep 8

echo "3. Importing upgraded database..."
if ! docker ps --format '{{.Names}}' | grep -q '^jarra-holding-group-website-db$'; then
  echo "Postgres container is not running."
  exit 1
fi
# Strip PG 17+/18-only lines for Postgres 16 server
sed -e '/transaction_timeout/d' -e '/^\\restrict/d' -e '/^\\unrestrict/d' "$SNAPSHOT" | \
docker exec -i -e "PGPASSWORD=$DB_PASSWORD" jarra-holding-group-website-db \
  psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1

echo "4. Extracting reprocessed uploads..."
cd "$REPO_ROOT/backend"
rm -rf uploads
tar -xzf deploy-uploads.tar.gz

echo "5. Building and starting services..."
cd "$REPO_ROOT"
docker compose up -d --build

echo ""
echo "=== Deploy complete ==="
echo "Backup (if any): $BACKUP_DIR"
echo "Site: https://www.waaams.org"
echo "Admin: https://www.waaams.org/en/access/identity/gateway"
