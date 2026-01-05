# Módulo de Derivaciones de Servicios

## Descripción
Este módulo gestiona el sistema de derivaciones de servicios entre funcionarios de la notaría. Permite transferir la responsabilidad de un servicio de un funcionario a otro, con un flujo de aceptación/rechazo y notificaciones.

## Endpoints Principales

### POST /admin/derivaciones
Crear una nueva derivación de servicio.

**Body:**
```json
{
  "servicioId": "clxxx",
  "usuarioDestinoId": "clyyy",
  "motivo": "Especialización en el área",
  "prioridad": "alta",
  "comentario": "Requiere atención urgente"
}
```

### POST /admin/derivaciones/list
**Endpoint principal para listar y filtrar derivaciones con múltiples criterios.**

Permite a usuarios normales ver sus derivaciones y a super administradores ver derivaciones de todos los funcionarios.

**Filtros disponibles:**

#### Filtros por Usuario
```json
{
  "where": {
    "usuarioOrigenId": { "equals": "clxxx" },
    "usuarioDestinoId": { "equals": "clyyy" }
  },
  "page": 1,
  "size": 10
}
```

#### Filtros por Rango de Fechas
```json
{
  "where": {
    "fechaDerivacion": {
      "gte": "2026-01-01T00:00:00.000Z",
      "lte": "2026-01-31T23:59:59.999Z"
    }
  }
}
```

#### Filtros por Tipo de Trámite
```json
{
  "where": {
    "tramiteId": "tipo_tramite_id"
  }
}
```

#### Filtros por Estado y Prioridad
```json
{
  "where": {
    "aceptada": { "equals": false },
    "prioridad": "urgente"
  }
}
```

#### Filtro Combinado (Super Admin - Ver todo)
```json
{
  "where": {
    "fechaDerivacion": {
      "gte": "2026-01-01T00:00:00.000Z",
      "lte": "2026-01-31T23:59:59.999Z"
    },
    "tramiteId": "tipo_tramite_id",
    "usuarioOrigenId": { "contains": "nombre_funcionario" },
    "aceptada": { "equals": false },
    "prioridad": "alta"
  },
  "page": 1,
  "size": 20,
  "orderBy": { "fechaDerivacion": "desc" }
}
```

**Respuesta incluye:**
- Datos de la derivación
- Información del servicio (codigoTicket, tipo de trámite, cliente)
- Datos del funcionario origen y destino
- Estado de aceptación
- Paginación

### GET /admin/derivaciones/mis-derivaciones/pendientes
Obtener derivaciones pendientes de aceptar del usuario actual.

### GET /admin/derivaciones/mis-derivaciones/enviadas
Obtener derivaciones enviadas por el usuario actual.

### GET /admin/derivaciones/servicio/:servicioId
Historial completo de derivaciones de un servicio específico.

### GET /admin/derivaciones/:id
Detalle de una derivación específica.

### PATCH /admin/derivaciones/:id/aceptar
Aceptar una derivación recibida.

**Body:**
```json
{
  "comentario": "Acepto la derivación"
}
```

**Efectos:**
- Marca la derivación como aceptada
- Crea un registro de ResponsableServicio
- Envía notificación al usuario origen

### PATCH /admin/derivaciones/:id/rechazar
Rechazar una derivación recibida.

**Body:**
```json
{
  "motivoRechazo": "No tengo disponibilidad en este momento"
}
```

**Efectos:**
- Elimina el registro de derivación
- Envía notificación al usuario origen con el motivo

## Permisos
- `SERVICIOS_VER`: Ver derivaciones
- `SERVICIOS_CREAR`: Crear derivaciones
- `SERVICIOS_EDITAR`: Aceptar/rechazar derivaciones

## Flujo de Trabajo

1. **Creación**: Un funcionario crea una derivación hacia otro funcionario
2. **Notificación**: El sistema notifica al funcionario destino
3. **Decisión**: El funcionario destino puede:
   - **Aceptar**: Se convierte en responsable del servicio
   - **Rechazar**: La derivación se elimina y se notifica al origen
4. **Historial**: Todas las derivaciones quedan registradas en el historial del servicio

## Casos de Uso

### Usuario Normal
- Ver mis derivaciones pendientes de aceptar
- Ver derivaciones que he enviado
- Crear nuevas derivaciones
- Aceptar/rechazar derivaciones recibidas

### Super Administrador
- Ver todas las derivaciones del sistema
- Filtrar por funcionario, fecha, trámite
- Monitorear carga de trabajo por funcionario
- Analizar tiempos de respuesta en derivaciones
- Reportes por periodo de tiempo

## Notas Importantes

1. Solo el usuario destino puede aceptar/rechazar una derivación
2. Al aceptar una derivación, se convierte en responsable del servicio
3. Al rechazar, la derivación se elimina completamente
4. Todas las acciones generan notificaciones
5. El historial de derivaciones se mantiene para auditoría
