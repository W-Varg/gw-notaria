#!/usr/bin/env bash
# simulate_failure.sh
# Creates a feature branch and introduces an intentional error for CI staging simulation.

set -euo pipefail

USAGE="Usage: $0 [--push]
  --push    Push the feature branch to origin after commit (off by default)
"

PUSH=false
if [ "${1:-}" = "--push" ]; then
  PUSH=true
fi

BRANCH="feature/fallo-staging-$(date +%s)"
TARGET_FILE="src/main.ts"

if [ ! -f "$TARGET_FILE" ]; then
  echo "Target file $TARGET_FILE not found. Aborting." >&2
  exit 1
fi

echo "Creating branch: $BRANCH"
git checkout -b "$BRANCH"

echo "Introducing intentional error into $TARGET_FILE"
echo "\n// ERROR_INTENCIONAL: falla para CI" >> "$TARGET_FILE"

git add "$TARGET_FILE"
git commit -m "ci(test): introduce ERROR_INTENCIONAL to break staging for simulation"

if [ "$PUSH" = true ]; then
  echo "Pushing branch to origin: $BRANCH"
  git push origin "$BRANCH"
else
  echo "Branch created locally: $BRANCH (not pushed). To push: $0 --push"
fi

echo "Simulation branch ready. Open a PR to main to trigger the deployment to staging."
