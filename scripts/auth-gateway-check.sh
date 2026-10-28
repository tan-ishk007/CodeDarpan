#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
TMP_DIR=$(mktemp -d)
PID=""
cleanup() { if [ -n "$PID" ]; then kill "$PID" 2>/dev/null || true; fi; rm -rf "$TMP_DIR"; }
trap cleanup EXIT
pnpm --dir "$ROOT" build >/dev/null
(
  cd "$ROOT"
  PORT=3010 BACKEND_PORT=3011 CODEDARPAN_REQUIRE_AUTH=true \
  CODEDARPAN_DB_PATH="$TMP_DIR/auth.sqlite" CODEDARPAN_TOKEN_SECRET='gateway-test-secret' \
  CODEDARPAN_PUBLIC_HTTPS=false APP_ROOT="$ROOT" node deploy/entrypoint.mjs
) >"$TMP_DIR/gateway.log" 2>&1 &
PID=$!
for i in $(seq 1 100); do
  if curl -fsS http://127.0.0.1:3010/api/health >/dev/null 2>&1; then break; fi
  sleep .1
done
EMAIL="gateway-$(date +%s%N)@example.test"
printf '%s' '{"email":"'"$EMAIL"'","password":"correct horse battery staple"}' |
  curl -fsS -c "$TMP_DIR/cookies.txt" -H 'content-type: application/json' --data-binary @- \
  http://127.0.0.1:3010/api/auth/register > "$TMP_DIR/register.json"
curl -fsS -b "$TMP_DIR/cookies.txt" http://127.0.0.1:3010/api/auth/me > "$TMP_DIR/me.json"
printf '%s' '{"repositoryUrl":"https://example.com/acme/project"}' |
  curl -sS -b "$TMP_DIR/cookies.txt" -H 'content-type: application/json' --data-binary @- \
  -o "$TMP_DIR/analysis.json" -w '%{http_code}' http://127.0.0.1:3010/api/analyses > "$TMP_DIR/analysis.status"
curl -fsS -b "$TMP_DIR/cookies.txt" -c "$TMP_DIR/cookies.txt" -X POST \
  http://127.0.0.1:3010/api/auth/logout >/dev/null
STATUS=$(curl -sS -o /dev/null -w '%{http_code}' -b "$TMP_DIR/cookies.txt" http://127.0.0.1:3010/api/auth/me)
python3 - "$TMP_DIR/register.json" "$TMP_DIR/me.json" "$TMP_DIR/analysis.status" "$STATUS" <<'PY'
import json,sys
reg,me=json.load(open(sys.argv[1])),json.load(open(sys.argv[2]))
assert reg['user']['email']==me['user']['email']
assert open(sys.argv[3]).read().strip()=='400'
assert sys.argv[4]=='401'
print('production gateway auth flow: passed')
PY
