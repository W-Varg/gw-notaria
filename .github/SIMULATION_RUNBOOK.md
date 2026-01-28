# Runbook: Simulación de fallo en Staging y procedimiento de rollback

Este runbook describe los pasos reproducibles para introducir un fallo intencional, provocar el deploy a `staging`, capturar evidencias y revertir el cambio.

Importante: los scripts creados no *pushean* por defecto. Revisar cambios antes de empujar.

Preparación

- Asegúrate de tener las credenciales git configuradas y permisos para crear ramas y abrir PRs.
- Opcional: tener el workflow `.github/workflows/cd-staging-prod.yml` instalado en el repo (ya añadido).

Pasos para simular fallo en staging

1. Crear la rama con el fallo (localmente):

```bash
./scripts/simulate_failure.sh
# para crear y pushear directamente:
./scripts/simulate_failure.sh --push
```

2. Abrir PR hacia `main` usando la rama creada (puede hacerse desde GitHub web).

3. Revisar ejecución del pipeline en GitHub Actions:

- Entrar a Actions → seleccionar la ejecución asociada a la PR o al merge a `main`.
- Capturar: salida del job `deploy_staging`, logs de rsync/ssh, y `release_id` mostrado por el job.

4. Verificar health check fallido en staging (el job `Health check staging` debería fallar):

```bash
curl -v "${STAGING_APP_URL:-http://staging.example.com}/api/health" || true
```

Captura de evidencias

- Guardar captura del job fallido (pantallazo o link al run).
- Guardar la salida del `curl /api/health` y del `readlink -f /var/www/backend_notaria/current` (si tienes acceso SSH):

```bash
ssh $STAGING_USER@$STAGING_HOST "readlink -f /var/www/backend_notaria/current"
```

Revertir y verificar rollback

1. Revertir el commit localmente y pushear el revert (opcional):

```bash
./scripts/revert_failure.sh
# para pushear el revert:
./scripts/revert_failure.sh --push
```

2. Una vez el pipeline despliegue la nueva release estable, verificar en el servidor:

```bash
ssh $STAGING_USER@$STAGING_HOST "readlink -f /var/www/backend_notaria/current"
```

3. Si necesitas hacer rollback manual en el servidor (por ejemplo, si el pipeline no lo hizo), ejecutar en el servidor:

```bash
bash ~/scripts/rollback_remote.sh
# o desde tu máquina local (requiere acceso ssh):
ssh $STAGING_USER@$STAGING_HOST 'bash -s' < scripts/rollback_remote.sh
```

Notas de evidencia y entrega

- Incluir capturas de: job fallido, aprobación en producción (si aplica), `readlink -f current` antes y después del rollback, `curl /api/health` mostrando 200 OK después del rollback, y logs del backend con `release` y `env`.
- Añadir release notes y tag semántico cuando tengas la versión estable.
