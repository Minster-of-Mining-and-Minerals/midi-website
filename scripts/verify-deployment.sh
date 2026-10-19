#!/usr/bin/env bash
# =================================================================
# Mineral Industry Development Institute (MIDI) Portal
# Verification & Health Check Script for Server 10.100.14.6
# =================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

ENV_FILE=".env.production"
if [ ! -f "$ENV_FILE" ]; then
  if [ -f ".env" ]; then
    ENV_FILE=".env"
  fi
fi

get_env_val() {
  local var="$1"
  local default_val="$2"
  if [ -f "$ENV_FILE" ]; then
    local val
    val="$(grep -E "^[[:space:]]*${var}=" "$ENV_FILE" | tail -n 1 | cut -d '=' -f2- | tr -d '\r' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    val="${val%\"}"; val="${val#\"}"
    val="${val%\'}"; val="${val#\'}"
    if [ -n "$val" ]; then
      echo "$val"
      return
    fi
  fi
  echo "$default_val"
}

SERVER_IP="$(get_env_val "SERVER_IP" "10.100.14.6")"
FRONTEND_PORT="$(get_env_val "FRONTEND_PORT" "3005")"
BACKEND_PORT="$(get_env_val "BACKEND_PORT" "4005")"
SOCKET_PORT="$(get_env_val "SOCKET_PORT" "5005")"
NGINX_PORT="$(get_env_val "NGINX_PORT" "8085")"

echo "================================================================="
echo " Verifying MIDI Portal Deployment on Server: $SERVER_IP"
echo "================================================================="

# 1. Container Status Check
echo ""
echo "1. Checking Container Status..."
CONTAINERS=("midi_postgres_prod" "midi_backend_prod" "midi_frontend_prod" "midi_nginx_prod")
ALL_OK=0

for c in "${CONTAINERS[@]}"; do
  if docker ps --format '{{.Names}}' | grep -q "^${c}$"; then
    STATUS="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$c")"
    echo "   [✓] $c: RUNNING ($STATUS)"
  else
    echo "   [✗] $c: NOT RUNNING!"
    ALL_OK=1
  fi
done

# 2. Host Port Binding Check
echo ""
echo "2. Checking Docker Published Host Ports..."
for port in "$FRONTEND_PORT" "$BACKEND_PORT" "$SOCKET_PORT" "$NGINX_PORT"; do
  MATCH="$(docker ps --format '{{.Names}}\t{{.Ports}}' | grep -E "0\.0\.0\.0:${port}->" || true)"
  if [ -n "$MATCH" ]; then
    echo "   [✓] Port $port is bound by: $MATCH"
  else
    echo "   [✗] Port $port is NOT published by any container!"
    ALL_OK=1
  fi
done

# 3. HTTP Endpoints Check
echo ""
echo "3. Performing HTTP Checks..."

# Helper test function
test_http() {
  local label="$1"
  local url="$2"
  local expected_code="$3"
  
  if command -v curl >/dev/null 2>&1; then
    HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" || echo "000")"
    if [ "$HTTP_CODE" = "$expected_code" ] || ([ "$expected_code" = "200" ] && [ "$HTTP_CODE" = "307" ]); then
      echo "   [✓] $label: HTTP $HTTP_CODE (Passed) -> $url"
    else
      echo "   [✗] $label: HTTP $HTTP_CODE (Expected $expected_code) -> $url"
      ALL_OK=1
    fi
  else
    echo "   [!] curl not installed; skipping HTTP probe for $url"
  fi
}

test_http "Frontend Direct (Host 3005)" "http://127.0.0.1:${FRONTEND_PORT}" "200"
test_http "Backend Health (Host 4005)" "http://127.0.0.1:${BACKEND_PORT}/health" "200"
test_http "Backend API Health" "http://127.0.0.1:${BACKEND_PORT}/api/health" "200"
test_http "Nginx Proxy Health (Host 8085)" "http://127.0.0.1:${NGINX_PORT}/health" "200"

# 4. Socket.IO Handshake Check
echo ""
echo "4. Testing Socket.IO Handshake on Port $SOCKET_PORT..."
if command -v curl >/dev/null 2>&1; then
  SOCKET_RESP="$(curl -s --connect-timeout 5 "http://127.0.0.1:${SOCKET_PORT}/socket.io/?EIO=4&transport=polling" || true)"
  if echo "$SOCKET_RESP" | grep -q "sid"; then
    echo "   [✓] Socket.IO server returned valid handshake session packet:"
    echo "       $SOCKET_RESP"
  else
    echo "   [✗] Socket.IO handshake did not return a session id! Response:"
    echo "       $SOCKET_RESP"
    ALL_OK=1
  fi
else
  echo "   [!] curl not installed; skipping Socket.IO handshake probe."
fi

echo ""
echo "================================================================="
if [ "$ALL_OK" -eq 0 ]; then
  echo " [✓] ALL DEPLOYMENT VERIFICATION CHECKS PASSED!"
else
  echo " [✗] SOME CHECKS FAILED. Inspect the logs above or run:"
  echo "     docker compose -f docker-compose.prod.yml logs"
fi
echo "================================================================="
