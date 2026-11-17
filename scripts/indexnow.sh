#!/usr/bin/env bash
# Notify Bing/Yandex (IndexNow) of URLs after a deploy.
# Usage: scripts/indexnow.sh                 -> all sitemap URLs
#        scripts/indexnow.sh /gratuity.html   -> specific paths
set -euo pipefail
HOST=moneymindtool.com
KEY=762605c222721cdf414b4f5e7a51b1f8
if [ $# -gt 0 ]; then urls=$(printf '"https://%s%s",' $(for p in "$@"; do echo "$HOST $p"; done) | sed 's/,$//')
else urls=$(curl -s https://$HOST/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//; s/.*/"&"/' | paste -sd, -); fi
curl -s -o /dev/null -w "IndexNow HTTP %{http_code}\n" -X POST https://api.indexnow.org/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$urls]}"
