#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/var/www/syrtag.com/app"
BASE_DIR="/var/www/syrtag.com"
BACKUP_DIR="${BASE_DIR}/backups"
LOCK_FILE="${BASE_DIR}/deploy.lock"
REPOSITORY_URL="https://github.com/fan0269-code/syntag.git"
BRANCH="main"

exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "A deployment is already running."
  exit 1
fi

if [ ! -d "${APP_DIR}/.git" ]; then
  mkdir -p "${BACKUP_DIR}"
  backup_path="${BACKUP_DIR}/app-before-git-$(date +%Y%m%d%H%M%S).tar.gz"
  tar -C "${BASE_DIR}" --exclude="app/.env" --exclude="app/.next" --exclude="app/node_modules" -czf "${backup_path}" app

  git -C "${APP_DIR}" init -b "${BRANCH}"
  git -C "${APP_DIR}" remote add origin "${REPOSITORY_URL}"
fi

chown -R ubuntu:ubuntu "${APP_DIR}"

git -C "${APP_DIR}" fetch --depth=1 origin "${BRANCH}"
target_commit="$(git -C "${APP_DIR}" rev-parse FETCH_HEAD)"
current_commit="$(git -C "${APP_DIR}" rev-parse HEAD 2>/dev/null || true)"

if [ "${target_commit}" = "${current_commit}" ]; then
  echo "Already running ${target_commit}."
  exit 0
fi

git -C "${APP_DIR}" reset --hard "${target_commit}"

cd "${APP_DIR}"
npm ci
npx prisma migrate deploy
npm run build
chown -R ubuntu:ubuntu "${APP_DIR}"

sudo systemctl restart syrtag

for attempt in {1..12}; do
  if curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3100/ >/dev/null; then
    echo "Deployment complete: ${target_commit}"
    exit 0
  fi
  sleep 2
done

sudo systemctl status syrtag --no-pager
exit 1
