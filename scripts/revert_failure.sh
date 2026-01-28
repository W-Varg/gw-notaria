#!/usr/bin/env bash
# revert_failure.sh
# Revert the last local commit(s) that introduced the simulation error and optionally push the revert.

set -euo pipefail

USAGE="Usage: $0 [--push]
  --push    Push the revert to origin/main after reverting (off by default)
"

PUSH=false
if [ "${1:-}" = "--push" ]; then
  PUSH=true
fi

echo "Checking current branch..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "On branch: $BRANCH"

echo "Reverting last commit"
git revert HEAD --no-edit

if [ "$PUSH" = true ]; then
  echo "Pushing revert to origin $BRANCH"
  git push origin "$BRANCH"
else
  echo "Revert committed locally on $BRANCH (not pushed). To push: $0 --push"
fi
