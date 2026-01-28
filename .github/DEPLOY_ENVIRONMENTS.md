# GitHub Environments and Secrets for CD

Create two GitHub Environments: `staging` and `production`.

Required secrets (set in repository Settings → Secrets → Environments):

- `STAGING_USER` — SSH user for staging host
- `STAGING_HOST` — staging host/IP
- `STAGING_SSH_PRIVATE_KEY` — private key (add to Actions runner via `ssh-agent` step if desired)
- `STAGING_APP_URL` — public URL for health checks (e.g. https://staging.example.com)

- `PROD_USER` — SSH user for production host
- `PROD_HOST` — production host/IP
- `PROD_SSH_PRIVATE_KEY` — private key
- `PROD_APP_URL` — public URL for production health checks

Notes:
- Never commit secrets into the repo. Use GitHub Environments to require approvals for `production`.
- Configure environment protection rules in GitHub so production deployments require manual approval by the Release Manager.
- The workflow `cd-staging-prod.yml` expects these secrets; adjust variable names as needed.

Server layout expectations (per assignment):

  /var/www/backend_notaria/releases/<release_id>
  /var/www/backend_notaria/current -> /var/www/backend_notaria/releases/<release_id>
  /var/www/backend_notaria/shared/.env

On the server the deploy step runs `yarn install --production` and `npx prisma migrate deploy` (adjust if you use another migration strategy).
