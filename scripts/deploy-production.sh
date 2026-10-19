#!/usr/bin/env bash
# =================================================================
# Mineral Industry Development Institute (MIDI) Portal
# Production Deployment Script for Server 10.100.14.6
# =================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "================================================================="
echo " Starting MIDI Portal Production Deployment"
echo " Target Server: 10.100.14.6"
echo " Date: $(date)"
echo "================================================================="

# 1. Determine environment file
ENV_FILE=".env.production"
if [ ! -f "$ENV_FILE" ]; then
  if [ -f ".env" ]; then
    echo "[deploy] Notice: .env.production not found, falling back to .env"
    ENV_FILE=".env"
  else
    echo "[deploy] ERROR: Neither .env.production nor .env was found!"
    echo "Please copy .env.production.example to .env.production and configure secrets."
    exit 1
  fi
fi
echo "[deploy] Using environment configuration: $ENV_FILE"

# Function to parse variable from env file
get_env_val() {
  local var="$1"
  local default_val="$2"
  local val
  val="$(grep -E "^[[:space:]]*${var}=" "$ENV_FILE" | tail -n 1 | cut -d '=' -f2- | tr -d '\r' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
  val="${val%\"}"; val="${val#\"}"
  val="${val%\'}"; val="${val#\'}"
  if [ -n "$val" ]; then
    echo "$val"
  else
    echo "$default_val"
  fi
}

SERVER_IP="$(get_env_val "SERVER_IP" "10.100.14.6")"
FRONTEND_PORT="$(get_env_val "FRONTEND_PORT" "3005")"
BACKEND_PORT="$(get_env_val "BACKEND_PORT" "4005")"
SOCKET_PORT="$(get_env_val "SOCKET_PORT" "5005")"
NGINX_PORT="$(get_env_val "NGINX_PORT" "8085")"
DB_USER="$(get_env_val "DB_USER" "postgres")"
DB_PASSWORD="$(get_env_val "DB_PASSWORD" "root")"
DB_NAME="$(get_env_val "DB_NAME" "midi_portal")"

COMPOSE_FILE="docker-compose.prod.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "[deploy] ERROR: $COMPOSE_FILE not found in $REPO_ROOT"
  exit 1
fi

# 2. Check Docker and Docker Compose prerequisites
echo "[deploy] 1. Checking Docker engine and Compose availability..."
if ! command -v docker >/dev/null 2>&1; then
  echo "[deploy] ERROR: 'docker' command is not available in PATH!"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "[deploy] ERROR: 'docker compose' is not available!"
  exit 1
fi

# 3. Port conflict verification
echo "[deploy] 2. Checking availability of required host ports: $FRONTEND_PORT, $BACKEND_PORT, $SOCKET_PORT, $NGINX_PORT..."
check_port() {
  local port="$1"
  local service_name="$2"
  local conflict=0

  # Check with ss or netstat if available
  if command -v ss >/dev/null 2>&1; then
    if ss -lntp 2>/dev/null | grep -E "[:.]${port}[[:space:]]" | grep -qv "docker"; then
      conflict=1
    fi
  elif command -v netstat >/dev/null 2>&1; then
    if netstat -tuln 2>/dev/null | grep -E "[:.]${port}[[:space:]]" | grep -qv "docker"; then
      conflict=1
    fi
  fi

  # Check if occupied by an unrelated container
  local running_on_port
  running_on_port="$(docker ps --format '{{.Names}}\t{{.Ports}}' 2>/dev/null | grep -E "0\.0\.0\.0:${port}->" || true)"
  if [ -n "$running_on_port" ]; then
    if ! echo "$running_on_port" | grep -Eq "^midi_"; then
      conflict=1
    fi
  fi

  if [ "$conflict" -eq 1 ]; then
    echo "[deploy] ERROR: Port $port for $service_name is already in use by an unrelated host service or container!"
    echo "Details: $running_on_port"
    echo "Stopping deployment to prevent modifying unrelated services."
    exit 1
  fi
}

check_port "$FRONTEND_PORT" "Frontend Next.js"
check_port "$BACKEND_PORT" "Backend Express API"
check_port "$SOCKET_PORT" "Socket.IO Server"
check_port "$NGINX_PORT" "Nginx Reverse Proxy"
echo "[deploy]    All assigned host ports ($FRONTEND_PORT, $BACKEND_PORT, $SOCKET_PORT, $NGINX_PORT) are clear for MIDI deployment."

# 4. Database Pre-deploy Backup
BACKUP_DIR="$REPO_ROOT/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "[deploy] 3. Checking for running database to perform pre-deploy backup..."
DB_CONTAINER=""
if docker ps --format '{{.Names}}' | grep -q '^midi_postgres_prod$'; then
  DB_CONTAINER="midi_postgres_prod"
elif docker ps --format '{{.Names}}' | grep -q '^jarra-holding-group-website-db$'; then
  DB_CONTAINER="jarra-holding-group-website-db"
elif docker ps --format '{{.Names}}' | grep -q '^jarra_postgres_prod$'; then
  DB_CONTAINER="jarra_postgres_prod"
fi

if [ -n "$DB_CONTAINER" ]; then
  echo "[deploy]    Backing up database from $DB_CONTAINER to $BACKUP_DIR/pre-deploy.sql..."
  if docker exec -e "PGPASSWORD=$DB_PASSWORD" "$DB_CONTAINER" \
    pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner --no-acl \
    > "$BACKUP_DIR/pre-deploy.sql" 2>/dev/null; then
    echo "[deploy]    Pre-deploy database backup successfully created."
  else
    echo "[deploy]    Warning: Live backup failed or database does not exist yet. Continuing safely."
  fi
else
  echo "[deploy]    No active DB container found. Skipping pre-deploy dump."
fi

# 5. Extract uploads if archive is present and uploads directory is empty
echo "[deploy] 4. Checking upload assets..."
mkdir -p "$REPO_ROOT/backend/uploads"
if [ -f "$REPO_ROOT/backend/deploy-uploads.tar.gz" ]; then
  if [ -z "$(ls -A "$REPO_ROOT/backend/uploads" 2>/dev/null)" ]; then
    echo "[deploy]    Extracting backend/deploy-uploads.tar.gz into backend/uploads/..."
    tar -xzf "$REPO_ROOT/backend/deploy-uploads.tar.gz" -C "$REPO_ROOT/backend"
  else
    echo "[deploy]    backend/uploads already contains files. Preserving existing uploaded files."
  fi
fi

# 6. Build and start services using Docker Compose
echo "[deploy] 5. Building production images and starting services..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

# 7. Wait and verify health
echo "[deploy] 6. Verifying service health..."
MAX_WAIT=90
ELAPSED=0
ALL_HEALTHY=0

while [ "$ELAPSED" -lt "$MAX_WAIT" ]; do
  UNHEALTHY=0
  for svc in midi_postgres_prod midi_backend_prod midi_frontend_prod midi_nginx_prod; do
    if docker ps --format '{{.Names}}' | grep -q "^${svc}$"; then
      STATUS="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$svc" 2>/dev/null || echo "unknown")"
      if [ "$STATUS" != "healthy" ] && [ "$STATUS" != "running" ]; then
        UNHEALTHY=1
      fi
    else
      UNHEALTHY=1
    fi
  done

  if [ "$UNHEALTHY" -eq 0 ]; then
    ALL_HEALTHY=1
    break
  fi

  sleep 5
  ELAPSED=$((ELAPSED + 5))
  echo "[deploy]    Waiting for containers to report healthy ($ELAPSED/${MAX_WAIT}s)..."
done

if [ "$ALL_HEALTHY" -eq 1 ]; then
  echo "[deploy]    All MIDI containers are running and healthy!"
else
  echo "[deploy] Warning: Some containers took longer than ${MAX_WAIT}s to report healthy. Checking logs:"
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
fi

echo ""
echo "================================================================="
echo " MIDI Portal Deployment Completed Successfully!"
echo "================================================================="
echo " Assigned Access Endpoints:"
echo "   - Primary Frontend:       http://${SERVER_IP}:${FRONTEND_PORT}"
echo "   - Backend API:            http://${SERVER_IP}:${BACKEND_PORT}"
echo "   - Backend API Health:     http://${SERVER_IP}:${BACKEND_PORT}/health"
echo "   - Socket.IO Server:       http://${SERVER_IP}:${SOCKET_PORT}"
echo "   - Nginx Reverse Proxy:    http://${SERVER_IP}:${NGINX_PORT}"
echo "   - Nginx Health:           http://${SERVER_IP}:${NGINX_PORT}/health"
echo "   - Admin Gateway:          http://${SERVER_IP}:${FRONTEND_PORT}/en/access/identity/gateway"
echo "================================================================="
echo " Pre-deploy backup (if any): $BACKUP_DIR"
echo " Container status command:   docker compose -f $COMPOSE_FILE ps"
echo " View logs command:          docker compose -f $COMPOSE_FILE logs -f"
echo "================================================================="
