#!/usr/bin/env bash
# Packs the files that make up the live site into dist/site.tar.gz:
#   public/     the web root (served by nginx)
#   nginx.conf  the nginx server config of the site container
# Used by CI (.github/workflows/ci.yml) and by ./deploy.sh. Run `npm run build`
# first so css/tailwind.css is up to date. Add new public files here.
set -euo pipefail
cd "$(dirname "$0")/.."

FILES=(
    index.html ranker.html compare.html
    storage.js similar-names.js i18n.js
    sitemap.xml robots.txt site.webmanifest favicon.svg og-image.jpg
    fonts css js vendor
)

rm -rf dist
mkdir -p dist/site/public
cp -R "${FILES[@]}" dist/site/public/
cp nginx.conf dist/site/nginx.conf
# macOS tar: leave out Finder metadata (._ files and xattrs)
opts=()
tar --version 2>/dev/null | grep -q bsdtar && opts=(--no-xattrs --no-mac-metadata)
COPYFILE_DISABLE=1 tar "${opts[@]}" -czf dist/site.tar.gz -C dist/site public nginx.conf
echo "dist/site.tar.gz: $(du -h dist/site.tar.gz | cut -f1)"
