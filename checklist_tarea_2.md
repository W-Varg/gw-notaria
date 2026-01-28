# Checklist para Cumplir con Tarea 2 - Continuous Delivery por Ambientes + Rollback

Basado en `tarea_2.md`, adaptado al proyecto `backend-ntr` con NestJS, Prisma ORM, Yarn, Node.js 20+, y despliegue en containers Docker (staging-server y prod-server).

## 1. Preparación del Entorno

- [ ] Configurar GitHub Environments:
  - Crear environment "staging" en GitHub repo.
  - Crear environment "production" en GitHub repo con required reviewers (e.g., Release Manager).

- [x] Levantar containers: `docker-compose -f docker-compose.staging.yml up -d` y `docker-compose -f docker-compose.prod.yml up -d`.
- [x] Configurar servers: Ejecutar `./configure_servers.sh` para copiar .env y configurar SSH.
- [ ] Configurar GitHub Secrets:
  - STAGING_HOST: localhost
  - STAGING_PORT: 2222
  - STAGING_USER: deploy
  - STAGING_APP_URL: http://localhost:3001
  - PROD_HOST: localhost
  - PROD_PORT: 2223
  - PROD_USER: deploy
  - PROD_APP_URL: http://localhost:3002
  - SSH_PRIVATE_KEY: Contenido de ~/.ssh/id_rsa (para acceso SSH).

- [ ] Asegurar que los containers (staging-server y prod-server) tengan instalados:
  - Node.js 20+.
  - Yarn.
  - Prisma CLI (npx prisma).
  - PM2 (npm install -g pm2).
  - Directorios: /var/www/backend-ntr/releases, /var/www/backend-ntr/shared, /var/www/backend-ntr/current.
  - Servicio para reiniciar la app (PM2).

- [ ] Configurar .env en /var/www/backend-ntr/shared/ con variables de producción (DATABASE_URL apuntando a prod-db en localhost:5456, etc.).

## 2. Desarrollo y Validación Local

- [ ] Ejecutar comandos locales antes de cada PR/Merge:
  - `yarn install --production`
  - `yarn lint`
  - `yarn test`
  - `yarn build`

- [ ] Verificar que el build sea exitoso y el artifact incluya dist, node_modules, prisma.

## 3. Implementación del Pipeline CI/CD

- [ ] Actualizar `.github/workflows/cd-staging-prod.yml` (ya existe, ajustado):
  - Usar `runs-on: self-hosted` (tu runner local).
  - Build único con artifact.
  - Despliegue atómico por symlink.
  - Health checks: /api/health.
  - Rollback automático en failure.

- [ ] Probar el workflow manualmente con `workflow_dispatch`.

## 4. CD a Staging (Día 3)

- [ ] Push a main activa el pipeline.
- [ ] Verificar despliegue en staging-server:
  - Artifact descargado y extraído.
  - `yarn install --production`.
  - `npx prisma migrate deploy`.
  - Symlink `current` apunta a nueva release.
  - Reiniciar app (e.g., `pm2 restart app` o similar).
  - Health check 200 OK en STAGING_APP_URL/api/health.

## 5. CD a Producción (Día 4)

- [ ] Crear tag semántico (vX.Y.Z) para activar producción.
- [ ] Aprobación manual requerida en GitHub.
- [ ] Verificar despliegue en prod-server:
  - Similar a staging, pero con prod-db (DATABASE_URL ajustado).
  - Logs incluyen release, env, user_id (configurar en NestJS con winston).

## 6. Observabilidad Base

- [ ] Configurar logs en NestJS (usando winston):
  - Instalar winston: `yarn add winston`.
  - Usar configuración en `src/logger/winston.config.ts` (creada).
  - Integrar en app.module.ts o main.ts.
  - Incluir en operaciones: user_id, release, env.
- [ ] Pipeline muestra trazabilidad (e.g., en steps).

## 7. Simulación de Fallo + Rollback

- [ ] Crear rama feature/fallo-staging.
- [ ] Introducir error (e.g., en src/main.ts: `throw new Error('ERROR_INTENCIONAL');`).
- [ ] Commit y push: Pipeline debe fallar en staging.
- [ ] Revertir: `git checkout main; git revert HEAD --no-edit; git push`.
- [ ] Verificar rollback: Symlink apunta a versión anterior.

## 8. Evidencias a Entregar

- [ ] Captura del pipeline run staging (link o screenshot).
- [ ] Captura del pipeline run producción (pausa + aprobación).
- [ ] Captura de `readlink -f /var/www/backend-ntr/current` apuntando a release.
- [ ] Captura de rollback (si aplica).
- [ ] Captura de /api/health en staging y producción.
- [ ] Capturas de logs con contexto (release, env, user_id).

## 9. Validación Final

- [ ] Build único: Artifact único por release.
- [ ] Secrets no en repo/logs.
- [ ] Switch atómico: Symlink correcto.
- [ ] Approvals: Captura de aprobación.
- [ ] Rollback: Ejecutado y verificable.
- [ ] Health checks: 200 OK en ambos ambientes.
- [ ] Observabilidad: Logs correctos.

**Notas adicionales:**
- Los servers son containers Ubuntu, así que SSH usa localhost con puertos 2222/2223.
- Reinicio de app: Agregar comando en workflow (e.g., `ssh ... "pm2 restart backend-ntr"`).
- Si no hay docker-compose files, crearlos para staging y prod con Ubuntu + Node.js + Prisma.
- Probar todo en local antes de push.