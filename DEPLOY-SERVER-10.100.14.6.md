# Mineral Industry Development Institute (MIDI) Portal
## Docker Deployment Guide for Server `10.100.14.6`

This document provides step-by-step instructions for deploying and verifying the MIDI Website on the internal institutional server **10.100.14.6**.

---

## 1. Network & Port Allocation

The target server already hosts other services. To prevent conflicts, this project is assigned the following non-overlapping ports:

| Service | Host Port | Container Port | Protocol / Description | Mandatory URL |
| :--- | :---: | :---: | :--- | :--- |
| **Frontend (Next.js)** | **3005** | `3000` | HTTP / Direct frontend browser access | `http://10.100.14.6:3005` |
| **Backend (Express API)**| **4005** | `4000` | HTTP / REST API & static uploads | `http://10.100.14.6:4005` |
| **Socket.IO Server** | **5005** | `5000` | WebSocket / Polling real-time events | `http://10.100.14.6:5005` |
| **Nginx Reverse Proxy**| **8085** | `80` | HTTP / Reverse proxy & alternative entry | `http://10.100.14.6:8085` |
| **PostgreSQL Database**| *None* | `5432` | Internal Docker Network only (`midi_prod_network`) | `db:5432` |

> **IMPORTANT**:
> - Users access the site directly through port **3005** (`http://10.100.14.6:3005`).
> - The frontend is **not** redirected to port 8085.
> - Nginx is available on port **8085** for reverse-proxy access, debugging, or future centralized routing.
> - PostgreSQL is strictly isolated to the internal Docker network and **not** published to the host, protecting other databases running on port 5432.

---

## 2. Pre-Deployment Preparation

### A. Clone or Pull Latest Code on the Server
SSH into the server `10.100.14.6`:
```bash
ssh <user>@10.100.14.6
cd /path/to/midi-website
git fetch origin
git checkout test-production
git pull origin test-production
```

### B. Configure Environment Variables
Copy `.env.production.example` to `.env.production`:
```bash
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
```

Ensure the following values are configured:
```ini
SERVER_IP=10.100.14.6
FRONTEND_PORT=3005
BACKEND_PORT=4005
SOCKET_PORT=5005
NGINX_PORT=8085

NEXT_PUBLIC_BASE_URL=http://10.100.14.6:4005/api
NEXT_PUBLIC_BASE=http://10.100.14.6:4005
NEXT_PUBLIC_FILE_URL=http://10.100.14.6:4005
NEXT_PUBLIC_APP_URL=http://10.100.14.6:3005
NEXT_PUBLIC_SOCKET_URL=http://10.100.14.6:5005
INTERNAL_API_URL=http://backend:4000/api

AUTH_SECRET=<generate_a_secure_32_character_secret>
NEXTAUTH_SECRET=<generate_a_secure_32_character_secret>
AUTH_URL=http://10.100.14.6:3005/api/auth

JWT_SECRET=<generate_a_secure_32_character_secret>
FRONTEND_URL=http://10.100.14.6:3005
CORS_ALLOWED_ORIGINS=http://10.100.14.6:3005,http://10.100.14.6:8085

DB_USER=postgres
DB_PASSWORD=<your_secure_db_password>
DB_NAME=midi_portal
```

*(Tip: Generate random secrets using `openssl rand -base64 32`)*

### C. Verify Port Availability
Before launching, confirm that none of the assigned host ports are currently occupied:
```bash
# Check listening TCP sockets
ss -lntp '( sport = :3005 or sport = :4005 or sport = :5005 or sport = :8085 )'

# Check existing docker container bindings
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -E "3005|4005|5005|8085"
```
If an unrelated application occupies any of these ports, stop and contact the system administrator rather than terminating existing services.

---

## 3. Deployment Execution

### Method 1: Automated Script (Recommended)
Run the automated deployment script:
```bash
chmod +x deploy.sh scripts/deploy-production.sh scripts/verify-deployment.sh
./deploy.sh
```

The deployment script executes the following stages:
1. Validates Docker and Docker Compose engines.
2. Checks host port availability for 3005, 4005, 5005, and 8085.
3. Automatically backs up any existing live database to `backups/<timestamp>/pre-deploy.sql`.
4. Unpacks `backend/deploy-uploads.tar.gz` to `backend/uploads/` (if present and directory is empty).
5. Builds and launches all services via `docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build`.
6. Waits for container health checks to confirm healthy status.

### Method 2: Manual Step-by-Step Commands
```bash
# 1. Back up database if previously running
mkdir -p backups/manual
docker exec -e PGPASSWORD="$DB_PASSWORD" midi_postgres_prod \
  pg_dump -U postgres -d midi_portal --clean --if-exists --no-owner \
  > backups/manual/pre-deploy-$(date +%Y%m%d_%H%M%S).sql 2>/dev/null || true

# 2. Build and launch containers
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# 3. View startup logs
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f backend
```

---

## 4. Database Migrations and Seeding

Database migrations and idempotent seeders run automatically on container startup through `backend/docker-entrypoint.sh`:
1. **Migration check**: Executes `npx sequelize-cli db:migrate` against PostgreSQL.
2. **Idempotent seeders**: Executes permissions and publication categories seeders (`ON CONFLICT DO NOTHING`), preserving all existing data and preventing duplicate records.
3. **Existing data preservation**: Database state persists in the named Docker volume `midi_postgres_data_prod`.

To manually run migrations or seeds:
```bash
docker exec -it midi_backend_prod npx sequelize-cli db:migrate
docker exec -it midi_backend_prod npx sequelize-cli db:seed:all
```

---

## 5. Verification & Health Checks

Run the automated verification script:
```bash
./scripts/verify-deployment.sh
```

Or perform manual checks:
```bash
# 1. Verify container status and health
docker compose -f docker-compose.prod.yml --env-file .env.production ps

# 2. Check Frontend (Direct access on 3005)
curl -I http://127.0.0.1:3005

# 3. Check Backend API health
curl -s http://127.0.0.1:4005/health
curl -s http://127.0.0.1:4005/api/health

# 4. Check Socket.IO handshake on port 5005
curl -s "http://127.0.0.1:5005/socket.io/?EIO=4&transport=polling"

# 5. Check Nginx reverse proxy health
curl -I http://127.0.0.1:8085/health
```

### Browser Verification
From a client machine on the `10.100.x.x` network:
- **Primary Public Portal**: `http://10.100.14.6:3005`
- **Admin Gateway**: `http://10.100.14.6:3005/en/access/identity/gateway`
- **Backend API**: `http://10.100.14.6:4005/`
- **Swagger Documentation**: `http://10.100.14.6:4005/api-docs`
- **Nginx Reverse Proxy**: `http://10.100.14.6:8085`

---

## 6. Maintenance & Management

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f db
```

### Restart Services
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production restart
```

### Stop Application Safely (Preserving Data)
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production down
# Note: Do NOT add '-v' flag; '-v' deletes database volumes.
```

### Database Backup & Restore
```bash
# Backup
docker exec -e PGPASSWORD="$DB_PASSWORD" midi_postgres_prod \
  pg_dump -U postgres -d midi_portal --clean --if-exists --no-owner \
  > backups/midi_portal_$(date +%Y%m%d_%H%M%S).sql

# Restore
cat backups/midi_portal_backup.sql | \
  docker exec -i -e PGPASSWORD="$DB_PASSWORD" midi_postgres_prod \
  psql -U postgres -d midi_portal -v ON_ERROR_STOP=1
```
