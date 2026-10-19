# Mineral Industry Development Institute (MIDI) Portal — Deployment

Official Docker deployment documentation for the MIDI Portal.

For full, dedicated instructions on deploying to internal server **10.100.14.6**, please see:
👉 **[DEPLOY-SERVER-10.100.14.6.md](file:///c:/Users/Amanuel%20Daniel/Desktop/MoM/projects/midi-website-1/DEPLOY-SERVER-10.100.14.6.md)**

---

## Quick Reference — Server 10.100.14.6 Port Mappings

| Service | Host Port | Container Port | URL |
| :--- | :---: | :---: | :--- |
| **Frontend (Next.js)** | **3005** | `3000` | **http://10.100.14.6:3005** *(Primary Access URL)* |
| **Backend (Express API)**| **4005** | `4000` | **http://10.100.14.6:4005** |
| **Socket.IO Server** | **5005** | `5000` | **http://10.100.14.6:5005** |
| **Nginx Reverse Proxy**| **8085** | `80` | **http://10.100.14.6:8085** |
| **PostgreSQL Database**| *Internal* | `5432` | `db:5432` *(Isolated to Docker network)* |

---

## Quick Deploy Steps

```bash
# 1. Switch to deployment branch
git checkout test-production
git pull origin test-production

# 2. Copy and configure production environment
cp .env.production.example .env.production
nano .env.production

# 3. Run automated deployment script
chmod +x deploy.sh scripts/deploy-production.sh scripts/verify-deployment.sh
./deploy.sh

# 4. Verify deployment health
./scripts/verify-deployment.sh
```

---

## Access Endpoints

- **Portal Homepage**: `http://10.100.14.6:3005`
- **Admin Gateway**: `http://10.100.14.6:3005/en/access/identity/gateway`
- **API Health**: `http://10.100.14.6:4005/health`
- **API Docs (Swagger)**: `http://10.100.14.6:4005/api-docs`
- **Nginx Reverse Proxy**: `http://10.100.14.6:8085`
