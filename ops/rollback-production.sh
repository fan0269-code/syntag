#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/var/www/syrtag.com/app"
BASE_DIR="/var/www/syrtag.com"
BACKUP_DIR="${BASE_DIR}/backups"
LOCK_FILE="${BASE_DIR}/deploy.lock"

if [ "${SYRTAG_ROLLBACK_LOCK_HELD:-0}" != "1" ]; then
  exec 9>"${LOCK_FILE}"
  if ! flock -n 9; then
    echo "A deployment or rollback is already running." >&2
    exit 1
  fi
fi

if [ ! -d "${BACKUP_DIR}" ]; then
  echo "No rollback snapshot directory exists at ${BACKUP_DIR}." >&2
  exit 1
fi

snapshot="$(find "${BACKUP_DIR}" -maxdepth 1 -type f -name 'rollback-*.tar.gz' -printf '%T@ %p\n' | sort -nr | head -n 1 | cut -d' ' -f2-)"
if [ -z "${snapshot}" ] || [ ! -f "${snapshot}" ]; then
  echo "No rollback snapshot is available in ${BACKUP_DIR}." >&2
  exit 1
fi

snapshot_name="${snapshot##*/}"
if [[ ! "${snapshot_name}" =~ ^rollback-([0-9a-f]{40})-[0-9]{14}\.tar\.gz$ ]]; then
  echo "Rollback snapshot name does not contain a valid commit: ${snapshot_name}." >&2
  exit 1
fi
previous_commit="${BASH_REMATCH[1]}"
if ! git -C "${APP_DIR}" cat-file -e "${previous_commit}^{commit}"; then
  echo "Rollback commit is not available locally: ${previous_commit}." >&2
  exit 1
fi

echo "Rollback restores application code and build output only; database migrations are forward-only and must remain backward-compatible." >&2
echo "Stopping Syrtag before restoring ${snapshot}."
sudo systemctl stop syrtag
git -C "${APP_DIR}" reset --hard "${previous_commit}"
cd "${APP_DIR}"
npm ci
rm -rf "${APP_DIR}/.next"
tar -C "${APP_DIR}" -xzf "${snapshot}"
chown -R ubuntu:ubuntu "${APP_DIR}/.next"
sudo systemctl restart syrtag

for attempt in {1..12}; do
  if curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3100/ >/dev/null; then
    echo "Rollback complete: ${snapshot}"
    exit 0
  fi
  sleep 2
done

echo "Rollback health check failed after restoring ${snapshot}." >&2
sudo systemctl status syrtag --no-pager
exit 1
