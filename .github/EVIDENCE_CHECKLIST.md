# Checklist de Evidencias para la Entrega

Cada grupo debe incluir en su entrega las siguientes evidencias (capturas o enlaces):

- Pipeline run staging: enlace o captura del job (build + deploy_staging) mostrando `release_id`.
- Pipeline run producción: captura del paso en pausa y la aprobación manual (environment `production`).
- Captura del symlink `current` apuntando a `/var/www/backend_notaria/releases/<release_id>` en staging y producción:

  ssh $USER@$HOST "readlink -f /var/www/backend_notaria/current"

- Captura de rollback (si aplica): salida del comando `readlink -f` que muestre el cambio a la versión anterior.
- Captura del endpoint `/api/health` en staging y producción (200 OK).
- Capturas de logs backend que incluyan campos: `release` (ID), `env` (staging|production) y `user_id` en operaciones relevantes.
- Release notes asociado al tag (ej. `v2.0.0`) y su enlace.

Formato recomendado para la entrega: PDF con las capturas en el orden pedido, líneas de comando usadas y breve comentario de cada captura.
