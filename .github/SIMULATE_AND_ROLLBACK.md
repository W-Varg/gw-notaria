# Simulación de fallo en Staging y Rollback

Instrucciones para reproducir un fallo en staging y ejecutar rollback atómico por symlink.

1. Preparar un release (en local):

   - Crear feature con cambio intencional que rompa la app:

     git checkout -b feature/fallo-staging
     echo "ERROR_INTENCIONAL" >> src/main.ts
     git add . && git commit -m "ci: break staging intentionally" && git push origin feature/fallo-staging

   - Abrir PR hacia `main`. El pipeline `cd-staging-prod.yml` debe ejecutarse y, al deployear a staging, el health check fallará.

2. Verificar fallo en CI/CD

   - Captura la ejecución del job `deploy_staging` fallido y guarda enlace o captura de pantalla.

3. Ejecutar rollback (vía revert en el repo):

   - Revertir el commit que introdujo el fallo y push a `main`:

     git checkout main
     git revert HEAD --no-edit
     git push origin main

   - El pipeline realizará un nuevo release estable; una vez desplegado, en el servidor staging ejecutar:

     ssh $STAGING_USER@$STAGING_HOST "readlink -f /var/www/backend_notaria/current"

     Debe apuntar a la versión anterior estable.

4. Rollback manual (si el pipeline no realiza rollback automático):

   - Ejecutar en el servidor (puede usarse el script `scripts/rollback_remote.sh`):

     ssh $STAGING_USER@$STAGING_HOST 'bash -s' < scripts/rollback_remote.sh

   - El script busca la segunda release más reciente y apunta `current` a ella.

5. Notas importantes

   - Nunca subas claves ni secrets al repo. Usa GitHub Environments y secrets.
   - Asegúrate que `RELEASE_DIR` en el servidor coincide con `/var/www/backend_notaria/releases`.
