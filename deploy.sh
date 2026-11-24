#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Baby Name Ranker — manual deployment (fallback)
#
# Normally a push to main deploys automatically (.github/workflows/ci.yml).
# This script does the same by hand from a machine that has the BABY ssh alias
# (Omarchy, user tibor): build, test, package and hand the package to
# /usr/local/bin/deploy-static on the server, which tests the nginx config,
# swaps the files and rolls back when the site does not answer.
# ==============================================================================

SSH_HOST="BABY"
cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Uncommitted changes: the deploy is labelled with HEAD, but contains your working tree."
fi
REV="$(git rev-parse HEAD)"

echo "🎨 Building static assets & running tests..."
npm run build
npm test

echo "📦 Packaging site..."
./scripts/package-site.sh

echo "🚀 Deploying $REV to https://baby.casteleijn.com ..."
ssh -o RemoteCommand=none -o RequestTTY=no "${SSH_HOST}" \
    /usr/local/bin/deploy-static baby "$REV" < dist/site.tar.gz

STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://baby.casteleijn.com/ || true)
if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ Successfully deployed to https://baby.casteleijn.com (HTTP 200 OK)"
else
    echo "⚠️ Deployed, but endpoint returned HTTP $STATUS_CODE. Please verify in your browser."
fi
