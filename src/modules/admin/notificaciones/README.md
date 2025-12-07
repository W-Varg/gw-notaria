# Módulo de Notificaciones

Sistema completo de notificaciones integrado entre backend y frontend.

## Backend

### Estructura

```
backend_not/src/modules/admin/notificaciones/
├── dto/
│   ├── notificacion.input.dto.ts    # DTOs de entrada
│   └── notificacion.response.ts     # DTOs de respuesta
├── notificacion.controller.ts       # Endpoints REST
├── notificacion.service.ts          # Lógica de negocio
├── notificacion.entity.ts           # Entidades Swagger
└── notificacion.module.ts           # Módulo NestJS
```

### Modelo Prisma

```prisma
model Notificacion {
  id                  String   @id @default(cuid())
  usuarioId           String
  titulo              String   @db.VarChar(255)
  mensaje             String   @db.Text
  tipo                String   @default("info") @db.VarChar(20)
  leida               Boolean  @default(false)
  icono               String?  @db.VarChar(50)
  ruta                String?  @db.VarChar(255)
  fechaCreacion       DateTime @default(now())
  fechaActualizacion  DateTime @updatedAt
  
  usuario Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@index([usuarioId, leida, fechaCreacion])
}
```

### Endpoints

#### Endpoints CRUD Estándar
- `POST /notificaciones` - Crear notificación
- `GET /notificaciones` - Listar notificaciones del usuario
- `POST /notificaciones/list` - Listar con filtros y paginación
- `GET /notificaciones/:id` - Obtener notificación por ID
- `PATCH /notificaciones/:id` - Actualizar notificación
- `DELETE /notificaciones/:id` - Eliminar notificación

#### Endpoints Personalizados
- `GET /notificaciones/user/no-leidas` - Obtener notificaciones no leídas
- `GET /notificaciones/user/contador` - Contar notificaciones no leídas
- `PATCH /notificaciones/:id/marcar-leida` - Marcar como leída
- `PATCH /notificaciones/user/marcar-todas-leidas` - Marcar todas como leídas
- `DELETE /notificaciones/user/limpiar-leidas` - Eliminar todas las leídas

### Permisos

```typescript
NOTIFICACIONES_VER = 'NOTIFICACIONES_VER'
NOTIFICACIONES_CREAR = 'NOTIFICACIONES_CREAR'
NOTIFICACIONES_EDITAR = 'NOTIFICACIONES_EDITAR'
NOTIFICACIONES_ELIMINAR = 'NOTIFICACIONES_ELIMINAR'
```

## Frontend

### Estructura

```
frontend_not/src/views/admin/notificaciones/
├── services/
│   └── notificacionApi.service.ts   # Servicio HTTP
├── composables/
│   ├── useNotificaciones.ts         # Composable principal
│   └── index.ts                     # Barrel export
└── components/
    └── NotificacionesPopover.vue    # Componente popover
```

### Servicio API

```typescript
NotificacionApiService.getAllNotificaciones(params)
NotificacionApiService.getNotificacionById(id)
NotificacionApiService.getNotificacionesNoLeidas()
NotificacionApiService.contarNoLeidas()
NotificacionApiService.marcarComoLeida(id)
NotificacionApiService.marcarTodasComoLeidas()
NotificacionApiService.eliminarNotificacion(id)
NotificacionApiService.limpiarLeidas()
```

### Composable

```typescript
const {
  notificaciones,        // Notificaciones no leídas
  contadorNoLeidas,      // Contador badge
  isLoading,            // Estado de carga
  isMarkingAll,         // Marcando todas
  isClearing,           // Limpiando leídas
  marcarComoLeida,      // Función mutation
  marcarTodasLeidas,    // Función mutation
  eliminarNotificacion, // Función mutation
  limpiarLeidas,        // Función mutation
  refetch,              // Refrescar manualmente
} = useNotificaciones();
```

### Uso en Componentes

```vue
<script setup lang="ts">
import { useNotificaciones } from '@/views/admin/notificaciones/composables';

const { notificaciones, contadorNoLeidas } = useNotificaciones();
</script>

<template>
  <OverlayBadge :value="contadorNoLeidas > 0 ? contadorNoLeidas.toString() : undefined">
    <Button icon="pi pi-bell" @click="toggle" />
  </OverlayBadge>
</template>
```

## Tipos de Notificación

- `info` - Información general (azul)
- `warning` - Advertencias (naranja)
- `success` - Operaciones exitosas (verde)
- `error` - Errores (rojo)

## Iconos (PrimeIcons)

- `pi-check-circle` - Éxito
- `pi-exclamation-triangle` - Advertencia
- `pi-info-circle` - Información
- `pi-times-circle` - Error
- `pi-user-plus` - Usuarios
- `pi-download` - Descargas

## Flujo de Trabajo

1. **Backend crea notificación**:
   ```typescript
   await this.notificacionService.create({
     usuarioId: '...',
     titulo: 'Nueva categoría',
     mensaje: 'Se ha creado la categoría "Documentos"',
     tipo: 'success',
     icono: 'pi-check-circle',
     ruta: '/admin/catalogos/categorias'
   });
   ```

2. **Frontend obtiene notificaciones**:
   - El composable hace polling cada 60 segundos
   - El badge muestra el contador actualizado
   - El popover lista las notificaciones no leídas

3. **Usuario interactúa**:
   - Click en notificación → marca como leída + navega a ruta
   - Click en "Marcar todas como leídas" → actualiza todas
   - Click en "Limpiar leídas" → elimina todas las leídas
   - Click en X → elimina notificación específica

## Características

- ✅ Polling automático cada 60 segundos
- ✅ Cache de 30 segundos
- ✅ Invalidación de queries tras mutaciones
- ✅ Skeleton loaders durante carga
- ✅ Formato de fechas relativas con Luxon
- ✅ Navegación desde notificaciones
- ✅ Badge dinámico en topbar
- ✅ Indicadores visuales (colores por tipo)
- ✅ Permisos por operación
- ✅ TypeScript end-to-end

## Integración

El módulo está completamente integrado:

1. Backend: Registrado en `AdminModule`
2. Frontend: Integrado en `AppTopbar.vue`
3. Tipos: Auto-generados con `pnpm codegen`
4. Permisos: Definidos en `permisos.enum.ts`
5. Base de datos: Migración `20251207172603_add_notificaciones_module`
