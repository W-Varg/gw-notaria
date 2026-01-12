# Servicios Backend para el Módulo de Servicios/Trámites

Basado en el análisis del componente frontend `ServiciosCard.vue`, se requieren los siguientes endpoints y servicios en el backend:

## 1. Endpoints Principales

### 1.1 Estadísticas del Dashboard
```typescript
GET /servicios/stats
Response: ResponseServiciosStatsType
```

**Propósito:** Obtener contadores y totales para los badges del dashboard.

**Response Data:**
```typescript
{
  enProceso: number;        // Count de servicios en estado "En Proceso"
  pendientePago: number;    // Count de servicios con saldoPendiente > 0
  finalizados: number;      // Count de servicios en estado "Finalizado"
  total: number;            // Count total de servicios activos
  totalPendienteCobro: number;  // SUM(saldoPendiente)
  totalIngresos: number;    // SUM(montoTotal - saldoPendiente)
}
```

### 1.2 Lista de Servicios con Filtros (Dashboard)
```typescript
GET /servicios/dashboard
Query: ServiciosDashboardFilterDto
Response: PaginateServiciosType
```

**Parámetros:**
- `estadoFiltro`: 'EN_PROCESO' | 'PENDIENTE_PAGO' | 'FINALIZADO' | 'TODOS'
- `search`: string (busca en codigoTicket, observaciones, nombre del cliente)
- `page`: number (default: 1)
- `pageSize`: number (default: 6)

**Include automático:**
- `cliente` (con `personaNatural` o `personaJuridica`)
- `tipoDocumento`
- `tipoTramite`
- `estadoActual`

**Lógica de filtros:**
- `EN_PROCESO`: `estadoActual.nombre = "En Proceso"`
- `PENDIENTE_PAGO`: `saldoPendiente > 0 AND estadoActual.nombre != "Finalizado"`
- `FINALIZADO`: `estadoActual.nombre = "Finalizado"`
- `TODOS`: Sin filtro de estado

### 1.3 Lista Completa con Filtros Avanzados
```typescript
GET /servicios
Query: ListServiciosArgsDto
Response: PaginateServiciosType
```

**Permite filtros granulares vía `where`:**
- `codigoTicket`: StringFilter (equals, contains, startsWith, etc.)
- `clienteId`: StringFilter
- `tipoDocumentoId`: StringFilter
- `tipoTramiteId`: StringFilter
- `estadoActualId`: StringNullableFilter
- `fechaInicio`: DateTimeFilter (gte, lte, between, etc.)
- `fechaFinalizacion`: DateTimeNullableFilter
- `prioridad`: StringNullableFilter
- `montoTotal`: FloatFilter (gte, lte, between)
- `saldoPendiente`: FloatFilter
- `estaActivo`: BoolFilter
- `search`: string (búsqueda de texto libre)

**Permite selección de relaciones vía `include`:**
- `cliente`, `tipoDocumento`, `tipoTramite`, `estadoActual`
- `historialEstadosServicio`, `responsablesServicio`
- `derivaciones`, `pagosIngresos`

### 1.4 Detalle de un Servicio
```typescript
GET /servicios/:id
Query: { include?: ServicioIncludeInput }
Response: ResponseServicioDetailType
```

**Propósito:** Obtener toda la información de un servicio, incluyendo relaciones.

### 1.5 Crear Servicio
```typescript
POST /servicios
Body: CreateServicioDto
Response: ResponseServicioType
```

**Campos requeridos:**
- `codigoTicket`: string (ej: "TKT-2026-001") - único, min 5, max 20
- `clienteId`: string
- `tipoDocumentoId`: string
- `tipoTramiteId`: string
- `montoTotal`: number

**Campos opcionales:**
- `estadoActualId`: string (default: "Recibido")
- `fechaEstimadaEntrega`: datetime
- `plazoEntregaDias`: number
- `prioridad`: 'normal' | 'alta' | 'urgente' (default: 'normal')
- `observaciones`: string
- `saldoPendiente`: number (default: montoTotal)

### 1.6 Actualizar Servicio
```typescript
PATCH /servicios/:id
Body: UpdateServicioDto
Response: ResponseServicioType
```

**Permite actualizar cualquier campo de CreateServicioDto más:**
- `fechaFinalizacion`: datetime
- `contenidoFinal`: string

### 1.7 Actualizar Estado/Progreso
```typescript
PATCH /servicios/:id/progreso
Body: UpdateServicioProgresoDto
Response: ResponseServicioType
```

**Body:**
```typescript
{
  estadoActualId: string;  // ID del nuevo estado
  comentario?: string;     // Comentario del cambio
}
```

**Lógica del servicio:**
1. Actualiza `servicio.estadoActualId`
2. Crea registro en `HistorialEstadosServicio` con:
   - `estadoId`: nuevo estado
   - `comentario`: comentario proporcionado
   - `fechaCambio`: timestamp actual
   - `cambiadoPor`: usuario autenticado

### 1.8 Registrar Pago
```typescript
POST /servicios/:id/pagos
Body: RegistrarPagoServicioDto
Response: ResponseServicioType
```

**Body:**
```typescript
{
  monto: number;              // Monto del pago
  tipoPago: number;           // 1=EFECTIVO, 2=QR, 3=TRANSFERENCIA, 4=CHEQUE, 5=DEPOSITO
  cuentaBancariaId?: number;  // Opcional, cuenta donde se recibió
  numeroConstancia?: string;  // Número de comprobante
  concepto?: string;          // Descripción del pago
}
```

**Lógica del servicio:**
1. Crea registro en `PagosIngresos` asociado al `servicioId`
2. Actualiza `servicio.saldoPendiente = saldoPendiente - monto`
3. Si `saldoPendiente <= 0`, puede cambiar estado a "Finalizado" (opcional)
4. Registra en `HistorialEstadosServicio` si cambia el estado

### 1.9 Eliminar (Soft Delete)
```typescript
DELETE /servicios/:id
Response: ResponseServicioType
```

**Lógica:** Actualiza `estaActivo = false` en lugar de eliminar el registro.

## 2. Estructura de DTOs

### Input DTOs (servicio.input-extended.dto.ts)
- ✅ `CreateServicioDto`: Validación con class-validator
- ✅ `UpdateServicioDto`: PartialType de CreateServicioDto + campos adicionales
- ✅ `ServicioWhereInput`: Filtros con prisma filters (StringFilter, DateTimeFilter, etc.)
- ✅ `ServicioIncludeInput`: Flags booleanos para incluir relaciones
- ✅ `ServicioSelectInput`: Flags para seleccionar campos específicos
- ✅ `ListServiciosArgsDto`: Extends BaseFilterDto con where/include/select
- ✅ `ServiciosDashboardFilterDto`: Filtros simplificados para el frontend
- ✅ `ServiciosStatsDto`: Estadísticas del dashboard
- ✅ `UpdateServicioProgresoDto`: Cambio de estado con comentario
- ✅ `RegistrarPagoServicioDto`: Registro de pago

### Response DTOs (servicio.response.ts)
- ✅ `ResponseServicioType`: Respuesta de un servicio individual
- ✅ `ResponseServicioDetailType`: Respuesta detallada con relaciones
- ✅ `ResponseServiciosType`: Lista simple sin paginación
- ✅ `PaginateServiciosType`: Lista paginada con counts
- ✅ `ResponseServiciosStatsType`: Respuesta de estadísticas

## 3. Lógica de Negocio en el Service

### 3.1 Método `getStats()`
```typescript
async getStats(): Promise<ServiciosStatsDto> {
  const [enProceso, pendientePago, finalizados, total, financials] = await Promise.all([
    this.prisma.servicio.count({
      where: { 
        estaActivo: true,
        estadoActual: { nombre: 'En Proceso' }
      }
    }),
    this.prisma.servicio.count({
      where: { 
        estaActivo: true,
        saldoPendiente: { gt: 0 },
        NOT: { estadoActual: { nombre: 'Finalizado' } }
      }
    }),
    this.prisma.servicio.count({
      where: { 
        estaActivo: true,
        estadoActual: { nombre: 'Finalizado' }
      }
    }),
    this.prisma.servicio.count({ where: { estaActivo: true } }),
    this.prisma.servicio.aggregate({
      where: { estaActivo: true },
      _sum: {
        saldoPendiente: true,
        montoTotal: true
      }
    })
  ]);

  return {
    enProceso,
    pendientePago,
    finalizados,
    total,
    totalPendienteCobro: financials._sum.saldoPendiente || 0,
    totalIngresos: (financials._sum.montoTotal || 0) - (financials._sum.saldoPendiente || 0)
  };
}
```

### 3.2 Método `findAllDashboard()`
```typescript
async findAllDashboard(filters: ServiciosDashboardFilterDto) {
  const { estadoFiltro, search, page = 1, pageSize = 6 } = filters;
  
  let where: any = { estaActivo: true };
  
  // Aplicar filtro por estado
  switch (estadoFiltro) {
    case 'EN_PROCESO':
      where.estadoActual = { nombre: 'En Proceso' };
      break;
    case 'PENDIENTE_PAGO':
      where.saldoPendiente = { gt: 0 };
      where.NOT = { estadoActual: { nombre: 'Finalizado' } };
      break;
    case 'FINALIZADO':
      where.estadoActual = { nombre: 'Finalizado' };
      break;
    // 'TODOS' no agrega filtro
  }
  
  // Aplicar búsqueda de texto
  if (search) {
    where.OR = [
      { codigoTicket: { contains: search, mode: 'insensitive' } },
      { observaciones: { contains: search, mode: 'insensitive' } },
      { cliente: { 
        OR: [
          { personaNatural: { 
            OR: [
              { nombres: { contains: search, mode: 'insensitive' } },
              { apellidoPaterno: { contains: search, mode: 'insensitive' } }
            ]
          }},
          { personaJuridica: { 
            razonSocial: { contains: search, mode: 'insensitive' }
          }}
        ]
      }}
    ];
  }
  
  const [data, total] = await Promise.all([
    this.prisma.servicio.findMany({
      where,
      include: {
        cliente: {
          include: {
            personaNatural: true,
            personaJuridica: true
          }
        },
        tipoDocumento: true,
        tipoTramite: true,
        estadoActual: true
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { fechaInicio: 'desc' }
    }),
    this.prisma.servicio.count({ where })
  ]);
  
  return {
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
```

### 3.3 Método `updateProgreso()`
```typescript
async updateProgreso(id: string, dto: UpdateServicioProgresoDto, usuarioId: string) {
  const servicio = await this.prisma.servicio.findUniqueOrThrow({
    where: { id }
  });
  
  // Actualizar el servicio
  const updated = await this.prisma.servicio.update({
    where: { id },
    data: { estadoActualId: dto.estadoActualId },
    include: {
      cliente: true,
      tipoDocumento: true,
      tipoTramite: true,
      estadoActual: true
    }
  });
  
  // Crear registro en historial
  await this.prisma.historialEstadosServicio.create({
    data: {
      servicioId: id,
      estadoId: dto.estadoActualId,
      comentario: dto.comentario,
      fechaCambio: new Date(),
      cambiadoPor: usuarioId
    }
  });
  
  return updated;
}
```

### 3.4 Método `registrarPago()`
```typescript
async registrarPago(id: string, dto: RegistrarPagoServicioDto, usuarioId: string) {
  const servicio = await this.prisma.servicio.findUniqueOrThrow({
    where: { id }
  });
  
  if (dto.monto > servicio.saldoPendiente) {
    throw new BadRequestException('El monto del pago no puede ser mayor al saldo pendiente');
  }
  
  const nuevoSaldo = servicio.saldoPendiente - dto.monto;
  
  // Registrar pago
  await this.prisma.pagosIngresos.create({
    data: {
      monto: dto.monto,
      tipoPago: dto.tipoPago,
      cuentaBancariaId: dto.cuentaBancariaId,
      numeroConstancia: dto.numeroConstancia,
      concepto: dto.concepto,
      servicioId: id,
      estadoId: 1, // Estado activo/confirmado
      realizadoPor: usuarioId
    }
  });
  
  // Actualizar saldo
  const updated = await this.prisma.servicio.update({
    where: { id },
    data: { saldoPendiente: nuevoSaldo },
    include: {
      cliente: true,
      tipoDocumento: true,
      tipoTramite: true,
      estadoActual: true
    }
  });
  
  // Si el saldo llegó a 0, cambiar estado a "Finalizado" (opcional)
  if (nuevoSaldo === 0) {
    const estadoFinalizado = await this.prisma.estadoTramite.findFirst({
      where: { nombre: 'Finalizado' }
    });
    
    if (estadoFinalizado) {
      await this.updateProgreso(
        id, 
        { 
          estadoActualId: estadoFinalizado.id, 
          comentario: 'Pago completado - Servicio finalizado' 
        },
        usuarioId
      );
    }
  }
  
  return updated;
}
```

## 4. Mapeo Frontend ↔ Backend

### 4.1 Tipos de Trámite (Carousel)
**Frontend necesita:**
- Lista de `TipoTramite` con `nombre`, `descripcion`, `imagen`

**Endpoint:** `GET /tipos-tramite` (ya existente en módulo catalogos)

### 4.2 Card de Servicio "En Proceso"
**Frontend muestra:**
- `numero`: `servicio.codigoTicket`
- `titulo`: `servicio.tipoDocumento.nombre`
- `tipo`: `servicio.tipoTramite.nombre`
- `solicitante`: `servicio.cliente.personaNatural.nombres + apellidoPaterno` o `cliente.personaJuridica.razonSocial`
- `fecha`: `servicio.fechaInicio`
- `progreso`: Calculado en frontend basado en `historialEstadosServicio` (0-100)
- `estado`: `servicio.estadoActual.nombre`

### 4.3 Card de Servicio "Pendiente de Pago"
**Frontend muestra:**
- Mismos campos que "En Proceso"
- `monto`: `servicio.saldoPendiente` (formateado como currency)

### 4.4 Card de Servicio "Finalizado"
**Frontend muestra:**
- Mismos campos base
- `fechaFin`: `servicio.fechaFinalizacion`

## 5. Consideraciones de Seguridad

1. **Autenticación:** Todos los endpoints requieren autenticación (JWT)
2. **Autorización:** Validar permisos por roles:
   - `SERVICIO_READ`: Listar y ver detalles
   - `SERVICIO_CREATE`: Crear servicios
   - `SERVICIO_UPDATE`: Actualizar servicios
   - `SERVICIO_DELETE`: Eliminar servicios
   - `SERVICIO_PAGO`: Registrar pagos
3. **Validación:** Usar class-validator en todos los DTOs
4. **Soft Delete:** Nunca eliminar físicamente, usar `estaActivo = false`
5. **Auditoría:** Registrar en `HistorialEstadosServicio` todos los cambios de estado
6. **Transacciones:** Usar transacciones Prisma en operaciones complejas (registrarPago)

## 6. Mejoras Futuras

1. **WebSocket:** Notificaciones en tiempo real cuando cambia el estado
2. **Reportes:** Endpoint para exportar servicios a PDF/Excel
3. **Calendario:** Vista de servicios por fecha estimada de entrega
4. **Asignación automática:** Algoritmo para asignar responsables según carga de trabajo
5. **Recordatorios:** Sistema de notificaciones para servicios próximos a vencer
6. **Dashboard avanzado:** Gráficos de tendencias, tiempos promedio por tipo de trámite
