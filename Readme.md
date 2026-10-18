# Mineral Industry Development Institute (MIDI) Portal

> Official institutional portal and content management platform for the Mineral Industry Development Institute (MIDI), Ethiopia, under the Ministry of Mines.

You can run everything with **Docker Compose** or run **backend** and **frontend** locally against a Postgres instance.

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
website/
├── backend/          # Express API, uploads, Sequelize
├── frontend/         # Next.js app (public site + admin)
├── docker-compose.yml
├── .env.example      # Docker Compose overrides (root)
├── backend/example.env
└── frontend/example.env
```

---

## Environment variables

Copy the example files and adjust for your machine. **Do not commit real `.env` files** (they are gitignored).

### Root `.env` (Docker Compose)

Used by `docker-compose.yml` for shared secrets:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | NextAuth session signing (frontend container) |
| `JWT_SECRET` | API JWT signing (backend container) |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Postgres credentials |

Generate strong secrets:

```bash
openssl rand -base64 48
```

Use the **same value** for `AUTH_SECRET` and `NEXTAUTH_SECRET` in the frontend env (see below).

### Backend `backend/.env`

```bash
cp backend/example.env backend/.env
```

Key variables:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signs login API tokens |
| `DB_*` | Database connection |
| `EMAIL_*` | Password reset / notifications |
| `FRONTEND_URL` | CORS and email links |
| `PORT` | API port (default `4000`) |

### Frontend `frontend/.env`

```bash
cp frontend/example.env frontend/.env
```

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | NextAuth (must match `NEXTAUTH_SECRET`) |
| `NEXTAUTH_SECRET` | NextAuth fallback secret |
| `NEXT_PUBLIC_BASE_URL` | API base URL (e.g. `http://localhost:4000/api`) |
| `NEXT_PUBLIC_FILE_URL` / `NEXT_PUBLIC_BASE` | Static files & uploads base |
| `NEXT_PUBLIC_FRONTEND_URL` | Public site URL |

**Local example**

```env
NEXT_PUBLIC_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_FILE_URL=http://localhost:4000
NEXT_PUBLIC_BASE=http://localhost:4000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
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

## Run with Docker Compose

From the repository root:

```bash
docker compose up -d --build
```

**URLs (default local mapping via nginx in production; direct container ports in dev)**

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Uploads | http://localhost:4000/uploads/... |

### Database setup (Docker)

Migrations run automatically when the backend container starts. To run manually:

```bash
docker exec -it jarra-holding-group-website-backend npm run migrate
docker exec -it jarra-holding-group-website-backend npm run seed
```

### Image reprocessing (Docker)

After migrations, generate WebP variants for **existing** uploads:

```bash
docker exec -it jarra-holding-group-website-backend npm run reprocess-attachments
```

---

## Run locally (without Docker)

### 1. Database

Create a Postgres database matching `DB_NAME` in `backend/.env` (e.g. `midi_portal`).

### 2. Backend

```bash
cd backend
npm install
npm run migrate
npm run seed          # optional initial data
npm run dev           # http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:3000
```

### 4. Image reprocessing (local)

With Postgres running and migrations applied:

```bash
cd backend
npm run reprocess-attachments
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

**PDFs, documents, audio, and video** are stored as a single file (no resizing).

### Frontend usage

Use `getImageUrl(attachment, size)` from `frontend/src/utils/fileUrl.ts`:

```ts
getImageUrl(gem.attachment, "large")   // public display (default)
getImageUrl(attachment, "large")       // admin preview
```

If variants are missing (old uploads), the helper falls back to `file_path`.

### When to run reprocess

Run `npm run reprocess-attachments` when:

- Setting up a fresh environment with existing upload data
- Deploying the image pipeline for the first time on production
- Restoring uploads from a backup that predates variants

**New uploads** are processed automatically; reprocess is only needed for older files.

---

## Useful commands

### Docker

```bash
docker compose stop          # stop containers
docker compose down          # stop and remove containers
docker compose down -v       # also remove DB volume (wipes data)
docker compose logs -f       # all logs
docker compose logs -f backend
```

### Backend

```bash
npm run dev                  # development server
npm run migrate              # apply Sequelize migrations
npm run migrate:undo         # undo last migration
npm run seed                 # run seeders
npm run reprocess-attachments  # build WebP variants for existing images
```

### Frontend

```bash
npm run dev                  # development server
npm run build                # production build
npm run start                # production server (after build)
```

---

## Production deploy

See **[DEPLOY.md](./DEPLOY.md)** for the full server rollout.

**Quick summary**

1. **Git:** push/pull `website-update` — includes upgraded `backend/db-snapshot.sql`.
2. **SCP:** copy `backend/deploy-uploads.tar.gz` (~1.8 GB) to the server separately (too large for GitHub).
3. **Server:** `chmod +x scripts/deploy-production.sh && ./scripts/deploy-production.sh`

Uploads persist via `./backend/uploads` volume mount in `docker-compose.yml`.

---

## Production notes

- Set strong `JWT_SECRET`, `AUTH_SECRET`, and `DB_PASSWORD` via server env or secrets manager — never use placeholder values.
- Ensure `NEXT_PUBLIC_*` URLs match your public domain (e.g. `https://www.waaams.org`).
- After deploy, run migrations and `reprocess-attachments` once if upgrading from a version without image variants.
- Uploads are served from `/uploads` with long-lived cache headers for images.

---

## Troubleshooting

| Issue | Check |
|---|---|
| Login redirect loop | `AUTH_SECRET` / `NEXTAUTH_SECRET` match and backend is reachable |
| Images still slow | Run `reprocess-attachments`; confirm network loads `.webp` not huge `.jpg` |
| Migration fails | Postgres running; `DB_*` in `backend/.env` correct |
| Sharp error in Docker | Rebuild backend image after dependency changes |

For full env templates, see `backend/example.env`, `frontend/example.env`, and `.env.example`.
