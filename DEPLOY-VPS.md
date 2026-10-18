# Production Deployment Guide (VPS)

This guide details the exact steps to deploy the Mineral Industry Development Institute (MIDI) portal to your VPS (`178.105.223.28`).

## 1. Initial VPS Setup

### DNS Configuration
Ensure that your DNS provider has an `A` record pointing to your VPS.
- **Type**: `A`
- **Host/Name**: `midi.gov.et` and `www.midi.gov.et` (or `@` and `www`). Ensure the full records resolve `midi.gov.et` and `www.midi.gov.et` to `178.105.223.28`.
- **Value**: `178.105.223.28`

## 2. Server Preparation

SSH into your VPS:
```bash
ssh root@178.105.223.28
```

Clone the repository and navigate into the project:
```bash
git clone <your-repo-url> midi-website
cd midi-website
```

## 3. Environment Variables Configuration

Copy the example production environment file:
```bash
cp .env.production.example .env.production
```

Edit the `.env.production` file using `nano` or `vim`:
```bash
nano .env.production
```
Make sure to fill in all the `generate-a-strong-secret-key-here` values and provide a strong `DB_PASSWORD`. Do NOT use `root` or `password` for production.

## 4. Run the Application

Start the Docker Compose production setup:
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

Verify that the containers are running:
```bash
docker compose -f docker-compose.prod.yml ps
```
You should see `jarra_frontend_prod`, `jarra_backend_prod`, `jarra_postgres_prod`, and `jarra_nginx_prod` in an "Up" state.

## 5. SSL Configuration (Let's Encrypt / Certbot)

Currently, Nginx is listening on port 80 and waiting for SSL generation. Do not skip this step!

Run Certbot to generate the SSL certificates:
```bash
docker compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d midi.gov.et -d www.midi.gov.et
```
Follow the interactive prompt (provide your email and agree to the TOS).

Once successful, uncomment the HTTPS block and the HTTP-to-HTTPS redirect block in `nginx/nginx.prod.conf`.

```bash
nano nginx/nginx.prod.conf
# Remove the '#' from the lines in the HTTPS Configuration section
# Also remove the '#' from the HTTP to HTTPS redirect inside the port 80 block.
```

Restart Nginx to apply the SSL configuration:
```bash
docker restart jarra_nginx_prod
```

## 6. Verification

Run these commands from the VPS to verify internal connections:
```bash
# Check if frontend is accessible internally
curl http://localhost:3000

# Check if backend is accessible internally
curl http://localhost:4000
```

From your local machine browser, navigate to:
- `https://midi.gov.et`
- `https://www.midi.gov.et`

Everything should now be live and secure!

### Additional Validation commands on the VPS:
- View backend logs: `docker logs jarra_backend_prod`
- View frontend logs: `docker logs jarra_frontend_prod`
- View nginx logs: `docker logs jarra_nginx_prod`
