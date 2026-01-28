#!/usr/bin/env bash
# rollback_remote.sh
# Best-effort rollback: switch /var/www/backend_notaria/current to previous release

set -euo pipefail

RELEASE_DIR="/var/www/backend_notaria/releases"
CURRENT_LINK="/var/www/backend_notaria/current"

if [ ! -d "$RELEASE_DIR" ]; then
  echo "Release dir not found: $RELEASE_DIR" >&2
  exit 1
fi

PREV=$(ls -1dt "$RELEASE_DIR"/*/ 2>/dev/null | sed -n '2p' | tr -d '/') || true

if [ -z "$PREV" ]; then
  echo "No previous release found, cannot rollback." >&2
  exit 1
fi

echo "Rolling back to: $PREV"
ln -sfn "$RELEASE_DIR/$PREV" "$CURRENT_LINK"
echo "Symlink updated: $CURRENT_LINK -> $(readlink -f "$CURRENT_LINK")"
