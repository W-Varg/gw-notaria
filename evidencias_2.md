# Evidencias - Proceso de Puesta en Marcha

Este archivo documentará paso a paso las acciones realizadas para poner en marcha el entorno de desarrollo, ejecutar migraciones, seed y pruebas. Añadiré entradas y marcaré los puntos donde se requiere que adjuntes capturas de pantalla.

## Índice
- 1) Levantar servicios con `docker-compose` (Postgres)
  - Estado: pendiente
  - Captura requerida: Sí (cuando el contenedor esté en estado `healthy` / `Up`)
- 2) Exportar `DATABASE_URL` y variables de entorno
  - Estado: pendiente
  - Captura requerida: Opcional
- 3) Ejecutar migraciones Prisma
  - Estado: pendiente
  - Captura requerida: Sí (salida de `prisma migrate dev` / `prisma migrate status`)
- 4) Generar cliente Prisma
  - Estado: pendiente
  - Captura requerida: Opcional
- 5) Cargar seed
  - Estado: pendiente
  - Captura requerida: Sí (salida del seed)
- 6) Ejecutar tests e2e
  - Estado: pendiente
  - Captura requerida: Sí (salida de `yarn test:e2e` mostrando tests pasados y sin handles abiertos)

---

### Notas iniciales
- Sistema operativo: Ubuntu (según contexto del usuario).
- Stack: Node.js, NestJS, Prisma (Postgres), Jest, Docker.


### Registro de acciones

*Pendiente de acciones.*

## 1) Levantar servicios con `docker-compose` (Postgres) - Ejecución

- Fecha: 2026-01-28
- Acción: Ejecutado `docker compose up -d` desde la raíz del proyecto.
- Resultado: Contenedor `backend_notaria_postgres` iniciado y en estado `Up`.

Salida relevante (ejecuta `docker ps` o `docker compose ps` para verificar):

```
backend_notaria_postgres    Up 47 seconds
```

Nota: Se detectó que el puerto host `5432` ya estaba en uso; actualicé `docker-compose.yml` para mapear a `5433:5432` y reinicié el contenedor.

- Nuevo mapeo de puertos: `0.0.0.0:5433->5432/tcp`

- Próximo paso: Toma una captura de pantalla que muestre la salida de `docker ps` (o del panel de contenedores) donde se vea `backend_notaria_postgres` y el mapeo `5433->5432`. Escribe `captura lista` cuando la tengas y continuaré con la exportación de `DATABASE_URL`, migraciones y generación del cliente Prisma.
Próximo paso: Toma una captura de pantalla que muestre la salida de `docker ps` (o del panel de contenedores) donde se vea `backend_notaria_postgres` y el mapeo `5433->5432`. Escribe `captura lista` cuando la tengas y continuaré con la exportación de `DATABASE_URL`, migraciones y generación del cliente Prisma.

## 2) Exportar `DATABASE_URL` y generar cliente Prisma

- Fecha: 2026-01-28
- Acción: Exporté `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/dev_db` y ejecuté `yarn prisma generate`.
- Resultado: Prisma Client generado correctamente en `./src/generated/prisma`.

Salida relevante:

```
✔ Generated Prisma Client (7.2.0) to ./src/generated/prisma in 552ms
```

Captura requerida: Opcional (si quieres conservar la salida en imagen).

## 3) Ejecutar migraciones Prisma

- Fecha: 2026-01-28
- Acción: Ejecuté `npx prisma migrate dev --name init` para crear y aplicar las migraciones necesarias según `schema.prisma`.
- Resultado: Se creó la migración `20260128072931_init` y se aplicó correctamente. Base de datos en sincronía.

Salida relevante:

```
Applying migration `20260128072931_init`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20260128072931_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

Captura requerida: Sí (si quieres incluir la salida de la migración). Toma captura y escribe `captura migracion lista`.

## 4) Ejecutar seed de Prisma

- Fecha: 2026-01-28
- Acción: Ejecuté `yarn prisma:seed` (ejecuta `ts-node prisma/seed/seed.ts`).
- Resultado: Seed completado correctamente; datos semilla creados en la BD.

Salida relevante (extracto):

```
Created 2 sucursales (notarías)
Created 5 usuarios
Created 6 roles
... (varios registros creados)
Seed de catalogo_servicio completado!
Seeding finished
```

Captura requerida: Sí (si quieres incluir salida del seed). Toma captura y escribe `captura seed lista`.

