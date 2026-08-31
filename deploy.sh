#!/usr/bin/env bash
set -e

# ==============================================================================
# Baby Name Ranker — Deployment Script
# Deploys static files to BABY server (~/deployments/baby/public) and ensures
# the baby-web Docker container is running on gateway-net.
# ==============================================================================

SSH_HOST="BABY"
REMOTE_DIR="~/deployments/baby"
PUBLIC_DIR="${REMOTE_DIR}/public"

SSH_OPTS="ssh -o RemoteCommand=none -o RequestTTY=no"

echo "🚀 Deploying Baby Name Ranker to https://baby.casteleijn.com ..."

# 1. Ensure remote directories exist
echo "📦 Setting up remote directories..."
ssh -o RemoteCommand=none -o RequestTTY=no "${SSH_HOST}" "mkdir -p ${PUBLIC_DIR}"

# 2. Sync web application files & Nginx config via rsync (differential delta transfer)
echo "📤 Syncing application files & config via rsync..."
rsync -avz -e "${SSH_OPTS}" \
    index.html \
    ranker.html \
    compare.html \
    storage.js \
    similar-names.js \
    i18n.js \
    sitemap.xml \
    robots.txt \
    site.webmanifest \
    favicon.svg \
    og-image.jpg \
    "${SSH_HOST}:${PUBLIC_DIR}/"

rsync -avz -e "${SSH_OPTS}" \
    nginx.conf \
    "${SSH_HOST}:${REMOTE_DIR}/nginx.conf"

# 3. Ensure docker-compose.yml exists and container is running
echo "🐳 Verifying Docker container..."
ssh -o RemoteCommand=none -o RequestTTY=no "${SSH_HOST}" "
cat << 'EOF' > ${REMOTE_DIR}/docker-compose.yml
services:
  baby-web:
    image: nginx:alpine
    container_name: baby-web
    restart: unless-stopped
    volumes:
      - ./public:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - gateway-net

networks:
  gateway-net:
    external: true
EOF
cd ${REMOTE_DIR} && docker compose up -d --force-recreate
"

# 4. Verify deployment
echo "🔍 Checking live endpoint..."
sleep 1
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://baby.casteleijn.com/ || true)

if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ Successfully deployed to https://baby.casteleijn.com (HTTP 200 OK)"
else
    echo "⚠️ Deployed, but endpoint returned HTTP $STATUS_CODE. Please verify in your browser."
fi
