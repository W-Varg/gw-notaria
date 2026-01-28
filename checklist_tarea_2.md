# Checklist para Cumplir con Tarea 2 - Continuous Delivery por Ambientes + Rollback

Basado en `tarea_2.md`, adaptado al proyecto `backend-ntr` con NestJS, Prisma ORM, Yarn, Node.js 20+, y despliegue en containers Docker (staging-server y prod-server).

## 1. Preparación del Entorno

- [x] Configurar GitHub Environments (pero es GitLab, usar environments en .gitlab-ci.yml).
- [ ] Configurar Variables en GitLab CI/CD (SSH_PRIVATE_KEY, etc.).

- [x] Asegurar que los containers (staging-server y prod-server) tengan instalados:
  - Node.js 20+.
  - Yarn.
  - Prisma CLI (npx prisma).
  - PM2 (npm install -g pm2).
  - Directorios: /var/www/backend-ntr/releases, /var/www/backend-ntr/shared, /var/www/backend-ntr/current.
  - Servicio para reiniciar la app (PM2).

- [x] Configurar .env en /var/www/backend-ntr/shared/ con variables de producción (DATABASE_URL apuntando a prod-db en localhost:5456, etc.).

## 2. Desarrollo y Validación Local

- [ ] Ejecutar comandos locales antes de cada PR/Merge:
  - `yarn install --production`
  - `yarn lint`
  - `yarn test`
  - `yarn build`

- [ ] Verificar que el build sea exitoso y el artifact incluya dist, node_modules, prisma.

## 3. Implementación del Pipeline CI/CD

- [x] Actualizar `.gitlab-ci.yml` (creado para GitLab CI).
- [ ] Probar el pipeline en GitLab (push a main activa staging, tag activa producción).
- [x] Verificar que el runner self-hosted esté corriendo.

## 4. CD a Staging (Día 3)

- [ ] Push a main activa el pipeline.
- [ ] Verificar despliegue en staging-server:
  - Artifact descargado y extraído.
  - `yarn install --production`.
  - `npx prisma migrate deploy`.
  - Symlink `current` apunta a nueva release.
  - Reiniciar app (e.g., `pm2 restart backend-ntr` o start si no existe).
  - Health check 200 OK en STAGING_APP_URL/api/health.

## 5. CD a Producción (Día 4)

- [ ] Crear tag semántico (vX.Y.Z) para activar producción.
- [ ] Aprobación manual requerida en GitLab.
- [ ] Verificar despliegue en prod-server:
  - Similar a staging, pero con prod-db (DATABASE_URL ajustado).
  - Logs incluyen release, env, user_id (configurar en NestJS con winston).

## 6. Observabilidad Base

- [x] Configurar logs en NestJS (usando winston):
  - Instalar winston: `yarn add winston`.
  - Usar configuración en `src/logger/winston.config.ts` (creada).
  - Integrar en app.module.ts o main.ts.
  - Incluir en operaciones: user_id, release, env.

- [ ] Pipeline muestra trazabilidad (e.g., en jobs).

## 7. Simulación de Fallo + Rollback

- [x] Crear rama feature/fallo-staging.
- [x] Introducir error (e.g., en src/main.ts: `throw new Error('ERROR_INTENCIONAL');`).
- [x] Commit y push: Pipeline debe fallar en staging.
- [ ] Revertir: `git checkout main; git revert HEAD --no-edit; git push`.
- [ ] Verificar rollback: Symlink apunta a versión anterior.

## 8. Evidencias a Entregar

- [ ] Captura del pipeline run staging (link o screenshot).
- [ ] Captura del pipeline run producción (pausa + aprobación).
- [ ] Captura de `readlink -f /var/www/backend-ntr/current` apuntando a release.
- [ ] Captura de rollback (si aplica).
- [ ] Captura del endpoint /api/health en staging y producción.
- [ ] Capturas de logs backend con contexto de release.

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
- Reinicio de app: Agregar comando en pipeline (e.g., `ssh ... "pm2 restart backend-ntr"`).
- Si no hay docker-compose files, crearlos para staging y prod con Ubuntu + Node.js + Prisma.
- Probar todo en local antes de push.