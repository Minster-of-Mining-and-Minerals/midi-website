# Mineral Industry Development Institute (MIDI) Portal

> Official institutional portal and content management platform for the Mineral Industry Development Institute (MIDI), Ethiopia, under the Ministry of Mines.

You can run everything with **Docker Compose** or run **backend** and **frontend** locally against a Postgres instance. For the production server, see [Production deployment (server 10.100.14.6)](#production-deployment-server-10100146).

---

## Prerequisites

**Docker (recommended for full stack)**

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Local development (without Docker)**

- Node.js 20+
- PostgreSQL 16+
- npm

---

## Project structure

```
midi-website/
├── backend/                     # Express API, Socket.IO, Sequelize, uploads
│   ├── migrations/ seeders/     # Database schema and initial data
│   ├── uploads/                 # Uploaded images and files (not in git)
│   └── storage/publications/    # Protected publication PDFs
├── frontend/                    # Next.js app (public site + admin)
├── nginx/nginx.conf             # Reverse proxy used by both compose files
├── scripts/
│   ├── deploy-production.sh     # Production deploy (backup, build, health wait)
│   └── verify-deployment.sh     # Post-deploy checks
├── docker-compose.yml           # Local / development stack
├── docker-compose.prod.yml      # Production stack (server 10.100.14.6)
├── deploy.sh                    # Shortcut for scripts/deploy-production.sh
├── .env.example                 # Root env for docker-compose.yml
└── .env.production.example      # Root env template for docker-compose.prod.yml
```

---

## Environment variables

Copy the example files and adjust for your machine. **Do not commit real `.env` files** (they are gitignored).

Each way of running the app reads a different file:

| Running | File | Template |
|---|---|---|
| Production (`docker-compose.prod.yml`) | `.env.production` (repo root) | `.env.production.example` |
| Local Docker (`docker-compose.yml`) | `.env` (repo root) | `.env.example` |
| Backend without Docker | `backend/.env` | `backend/.env.example` |
| Frontend without Docker | `frontend/.env` | `frontend/.env.example` |

`backend/.env` and `frontend/.env` are excluded from the Docker images, so they never affect a Docker deployment.

Generate strong secrets:

```bash
openssl rand -base64 48
```

### Backend `backend/.env`

```bash
cp backend/.env.example backend/.env
```

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signs login API tokens |
| `DB_*` | Database connection |
| `EMAIL_*` | Password reset / notifications |
| `FRONTEND_URL` | CORS and email links |
| `PORT` / `SOCKET_PORT` | API port (default `4000`) / Socket.IO port (default `5000`) |

### Frontend `frontend/.env`

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | NextAuth session secret (must match `NEXTAUTH_SECRET`) |
| `NEXTAUTH_SECRET` | NextAuth fallback secret |
| `NEXT_PUBLIC_BASE_URL` | API base URL (e.g. `http://localhost:4000/api`) |
| `NEXT_PUBLIC_FILE_URL` / `NEXT_PUBLIC_BASE` | Static files & uploads base |

**Local example**

```env
NEXT_PUBLIC_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_FILE_URL=http://localhost:4000
NEXT_PUBLIC_BASE=http://localhost:4000
AUTH_SECRET=<generate-with-openssl>
NEXTAUTH_SECRET=<same-as-AUTH_SECRET>
```

---

## Authentication routes

Admin login and password flows use the **identity gateway** (not `/login`):

| Page | URL |
|---|---|
| Login | `/en/access/identity/gateway` |
| Forgot password | `/en/access/identity/gateway/forgot-password` |
| Change password | `/en/access/identity/gateway/change-password` |

Legacy `/login` redirects to the public homepage. Unauthenticated access to `/admin/*` redirects to the gateway login.

---

## Run with Docker Compose (local)

From the repository root:

```bash
cp .env.example .env
docker compose up -d --build
```

| Service | URL | Container |
|---|---|---|
| Frontend | http://localhost:3005 | `midi_frontend` |
| Backend API | http://localhost:4005 | `midi_backend` |
| Socket.IO | http://localhost:5005 | `midi_backend` |
| Nginx | http://localhost:8085 | `midi_nginx` |
| Database | internal only | `midi_postgres` |

Migrations and the production seeders run automatically when the backend container starts. To load the default starter content, see [Seeding initial data](#seeding-initial-data) and use `midi_backend` instead of `midi_backend_prod`.

> `docker-compose.yml` publishes the same host ports as the production stack. Never run both on the same machine.

---

## Run locally (without Docker)

### 1. Database

Create a Postgres database matching `DB_NAME` in `backend/.env` (e.g. `midi_portal`).

### 2. Backend

```bash
cd backend
npm install
npm run migrate
npm run dev           # API http://localhost:4000, Socket.IO :5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:3000
```

---

## Production deployment (server 10.100.14.6)

This is how the site was first deployed on the Ministry server. The full reference (backups, restore, firewall, troubleshooting) is in **[DEPLOY-SERVER-10.100.14.6.md](./DEPLOY-SERVER-10.100.14.6.md)**.

### Ports

The server hosts other applications, so MIDI uses its own assigned ports:

| Service | Address | Container |
|---|---|---|
| **Frontend (main URL)** | **http://10.100.14.6:3005** | `midi_frontend_prod` |
| Backend API | http://10.100.14.6:4005 | `midi_backend_prod` |
| Socket.IO | http://10.100.14.6:5005 | `midi_backend_prod` (same container, port 5000) |
| Nginx reverse proxy | http://10.100.14.6:8085 | `midi_nginx_prod` |
| PostgreSQL | internal Docker network only | `midi_postgres_prod` |

Users open the site directly on port **3005**. Nginx on 8085 is an alternative entry point and is ready for a future domain name.

### Step 1: Get the code on the server

The server deploys the `deployment` branch. The repository is private, so cloning asks for a GitHub username and a **personal access token** as the password (GitHub → Settings → Developer settings → Fine-grained tokens; resource owner `Minster-of-Mining-and-Minerals`, repository `midi-website`, Contents: Read-only). Never paste the token anywhere except the terminal prompt.

```bash
ssh server-mom@10.100.14.6
cd ~/Projects
git clone -b deployment https://github.com/Minster-of-Mining-and-Minerals/midi-website.git
cd midi-website
```

If the server cannot reach GitHub, copy the code from a developer machine instead:

```bash
# On your computer, in the repo
git bundle create midi-deployment.bundle deployment
scp midi-deployment.bundle server-mom@10.100.14.6:~/Projects/
# On the server
cd ~/Projects && git clone -b deployment midi-deployment.bundle midi-website
```

### Step 2: Create `.env.production`

Real `.env` files are never in git, so create it on the server from the template and fill in random secrets:

```bash
cp .env.production.example .env.production
chmod 600 .env.production

sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=$(openssl rand -hex 24)|" .env.production
sed -i "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$(grep '^AUTH_SECRET=' .env.production | cut -d= -f2)|" .env.production
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$(openssl rand -hex 24)|" .env.production
sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$(openssl rand -hex 16)|" .env.production

nano .env.production    # set EMAIL_USER and EMAIL_PASS (Gmail app password)
```

Check the file without revealing secrets:

```bash
grep -E '^[A-Z_]+=' .env.production | sed -E 's/^((AUTH_SECRET|NEXTAUTH_SECRET|JWT_SECRET|DB_PASSWORD|EMAIL_PASS)=).+/\1****set****/'
```

- These secrets are only used between containers, which is why they are long and random. Nobody types them.
- **Keep a safe copy of this file outside the server.** Losing `JWT_SECRET`/`AUTH_SECRET` logs everyone out; losing `DB_PASSWORD` locks you out of the existing database.
- If MIDI was deployed on the server before, reuse the old `DB_PASSWORD`. Postgres keeps the password it was created with.

### Step 3: Deploy

```bash
chmod +x deploy.sh scripts/*.sh
./deploy.sh
```

The script checks Docker and the four ports (and stops if another application uses one), backs up the existing MIDI database and publication files, builds the images, starts the containers and waits until all of them are healthy. It exits with an error instead of reporting success if anything fails. The first build takes several minutes.

### Step 4: Verify

```bash
./scripts/verify-deployment.sh
```

Every line should show ✓. Then open `http://10.100.14.6:3005` from a computer on the office network. Type `http://` explicitly: the site does not serve HTTPS.

### Seeding initial data

A first deployment creates an empty database (tables and permissions only). To load the default starter content (admin account, admin menu, home page slider, mineral development pages), run these seeders **once, on an empty database**:

```bash
for s in \
  20251029134413-seed-permissions.js \
  20251029134401-seed-routes.js \
  admin-seeder.js \
  20260824160000-product-permissions.js \
  20261017-seed-midi-content.js \
  20261018230500-seed-midi-mineral-development-nodes.js \
  20261018231500-seed-five-mineral-development-pages.js
do
  echo "=== $s"
  docker exec midi_backend_prod npx sequelize-cli db:seed --seed "$s" || { echo "FAILED: $s"; break; }
done
docker compose -f docker-compose.prod.yml --env-file .env.production restart backend
```

Then log in at `http://10.100.14.6:3005/en/access/identity/gateway` with `admin@gmail.com` / `#Admin123` and **change the password immediately**. That default password is in the source code.

- **Never run `npm run seed` / `db:seed:all` on production.** It also runs the test (`seed-user-types`) and demo (`demo-users`) seeders.
- `admin-seeder.js` deletes and recreates the admin user and Super Admin role. Do not re-run it on a live database.
- Seeding only loads starter content. Real content (news, publications, images) comes from restoring a database dump and the uploads archive.

### Updating the site later

```bash
cd ~/Projects/midi-website
git pull origin deployment
./deploy.sh
./scripts/verify-deployment.sh
```

### Day-to-day commands (production)

```bash
# Status and logs
docker compose -f docker-compose.prod.yml --env-file .env.production ps
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f backend

# Restart
docker compose -f docker-compose.prod.yml --env-file .env.production restart

# Stop without losing data (never add -v: it deletes the database volume)
docker compose -f docker-compose.prod.yml --env-file .env.production down
```

---

## Image uploads & performance

Uploaded **images** (JPEG, PNG, WebP) are processed on the server with **Sharp** and stored as WebP variants:

| Variant | Max width | Typical use |
|---|---|---|
| `thumb` | 400px | Cards, lists, admin thumbnails |
| `medium` | 1200px | Detail sections, previews |
| `large` | 2400px | Hero banners, full-width |

Files are stored under:

```
uploads/attachments/{attachment_id}/
  thumb.webp
  medium.webp
  large.webp
  original_<name>.jpg   # kept for reference / download
```

**PDFs, documents, audio, and video** are stored as a single file (no resizing). Protected publication PDFs are stored separately in `backend/storage/publications/`.

### Frontend usage

Use `getImageUrl(attachment, size)` from `frontend/src/utils/fileUrl.ts`:

```ts
getImageUrl(attachment, "large")   // public display (default)
getImageUrl(attachment, "medium")  // admin preview
```

If variants are missing (old uploads), the helper falls back to `file_path`.

### Reprocessing older images

New uploads are processed automatically. To build WebP variants for images uploaded before the image pipeline existed (for example after restoring an old uploads archive):

```bash
# Production
docker exec midi_backend_prod node scripts/reprocess-attachments.js
# Local
cd backend && node scripts/reprocess-attachments.js
```

---

## Useful commands

### Backend

```bash
npm run dev                  # development server
npm run migrate              # apply Sequelize migrations
npm run migrate:undo         # undo last migration (never on production)
npm run seed:production      # the four idempotent production seeders
```

### Frontend

```bash
npm run dev                  # development server
npm run build                # production build
npm run start                # production server (after build)
```

---

## Troubleshooting

| Issue | Check |
|---|---|
| `No such container: midi-website-backend` | Containers are named `midi_backend_prod` (production) or `midi_backend` (local). Run `docker ps` to see the names. |
| Login says "Invalid email or password" | Check the admin user exists (see [Seeding initial data](#seeding-initial-data)), then `docker compose -f docker-compose.prod.yml logs frontend` for the real error |
| `504 Gateway Time-out` in the browser | Use `http://` (not `https://`), turn off VPNs/web shields, and make sure the device is on the office network |
| Login redirect loop | `AUTH_SECRET` / `NEXTAUTH_SECRET` match and backend is reachable |
| `npm install` fails with `EBADPLATFORM` in Docker | A Windows/macOS-only package was added as a direct dependency in `package.json` |
| Container not healthy after deploy | `docker compose -f docker-compose.prod.yml logs backend`: look for `FATAL` (failed migration or seeder) |
| Images still slow | Run the reprocess script; confirm the browser loads `.webp`, not large `.jpg` files |
