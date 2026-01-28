# Plantilla de Release Notes

Tag: vX.Y.Z

Title: release: CD environments + atomic deploy + health gates

Date: YYYY-MM-DD

Change summary:

- Build: single artifact containing `dist`, `prisma` migrations and `package.json`.
- Deploy: staging and production via SSH + rsync with atomic symlink switch.
- Rollback: symlink switch to previous release.

Breaking changes: (si aplica)

How to verify:

1. Check staging: curl -f "$STAGING_APP_URL/api/health"
2. Check production: curl -f "$PROD_APP_URL/api/health"

Release ID: ${RELEASE_ID}
