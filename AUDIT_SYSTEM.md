# Sistema de Auditoría

## Descripción General

El sistema de auditoría permite registrar automáticamente todas las acciones críticas realizadas por los usuarios en la aplicación, incluyendo:

- **Creación, edición y eliminación** de registros
- **Intentos de login** (exitosos y fallidos)
- **Cambios de datos** con comparación antes/después
- **Acceso a recursos** con métricas de rendimiento
- **Errores del sistema** con stack traces
- **Eventos del sistema** con niveles de severidad

## Arquitectura

### 1. Modelos de Datos (Prisma Schema)

El sistema utiliza **6 tablas especializadas** en el esquema `logs`:

#### `logs_audit_logs` - Registro Principal de Auditoría
```prisma
model AuditLog {
  id              String          @id @default(uuid())
  usuarioId       String?
  accion          TipoAccionEnum
  modulo          String
  tabla           String?
  registroId      String?
  descripcion     String?
  datosAnteriores Json?
  datosNuevos     Json?
  cambios         Json?
  ipAddress       String?
  userAgent       String?
  duracionMs      Int?
  creadoEn        DateTime        @default(now())
}
```

#### `logs_system_logs` - Logs del Sistema
```prisma
model SystemLog {
  id          String        @id @default(uuid())
  nivel       NivelLogEnum
  mensaje     String
  contexto    Json?
  stackTrace  String?
  creadoEn    DateTime      @default(now())
}
```

#### `logs_login_attempts` - Intentos de Inicio de Sesión
```prisma
model LoginAttempt {
  id                  String    @id @default(uuid())
  usuarioId           String?
  email               String
  exito               Boolean
  motivoFallo         String?
  ipAddress           String?
  userAgent           String?
  dispositivoConfianza Boolean  @default(false)
  esSospechoso        Boolean   @default(false)
  creadoEn            DateTime  @default(now())
}
```

#### `logs_access_logs` - Acceso a Recursos HTTP
```prisma
model AccessLog {
  id              String    @id @default(uuid())
  usuarioId       String?
  recurso         String
  metodo          String
  statusCode      Int?
  duracionMs      Int?
  ipAddress       String?
  userAgent       String?
  creadoEn        DateTime  @default(now())
}
```

#### `logs_data_change_logs` - Cambios Detallados Campo por Campo
```prisma
model DataChangeLog {
  id          String    @id @default(uuid())
  auditLogId  String?
  tabla       String
  registroId  String
  campo       String
  valorAntes  String?
  valorDespues String?
  creadoEn    DateTime  @default(now())
}
```

#### `logs_error_logs` - Registro de Errores
```prisma
model ErrorLog {
  id              String          @id @default(uuid())
  usuarioId       String?
  mensaje         String
  tipo            String?
  severidad       ErrorSeveridad
  stackTrace      String?
  contexto        Json?
  resuelto        Boolean         @default(false)
  resueltoPor     String?
  resueltoEn      DateTime?
  creadoEn        DateTime        @default(now())
}
```

### 2. Enumeraciones

```prisma
enum TipoAccionEnum {
  CREATE
  UPDATE
  DELETE
  READ
  LOGIN
  LOGOUT
  EXPORT
  IMPORT
  APPROVAL
  REJECTION
  RESTORE
  ARCHIVE
  SEND
  RECEIVE
  VERIFY
  PASSWORD_CHANGE
}

enum NivelLogEnum {
  INFO
  WARNING
  ERROR
  CRITICAL
  DEBUG
}

enum ErrorSeveridad {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

## Componentes del Sistema

### 1. AuditService (`src/global/services/audit.service.ts`)

Servicio global encargado de registrar todos los eventos de auditoría.

**Métodos Principales:**

```typescript
// Registrar acción de auditoría
async logAudit(data: {
  usuarioId?: string;
  accion: TipoAccionEnum;
  modulo: string;
  tabla?: string;
  registroId?: string;
  descripcion?: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  ipAddress?: string;
  userAgent?: string;
  duracionMs?: number;
}): Promise<void>

// Registrar log del sistema
async logSystem(data: {
  nivel: NivelLogEnum;
  mensaje: string;
  contexto?: any;
  stackTrace?: string;
}): Promise<void>

// Registrar intento de login
async logLoginAttempt(data: {
  usuarioId?: string;
  email: string;
  exito: boolean;
  motivoFallo?: string;
  ipAddress?: string;
  userAgent?: string;
  dispositivoConfianza?: boolean;
  esSospechoso?: boolean;
}): Promise<void>

// Registrar acceso HTTP
async logAccess(data: {
  usuarioId?: string;
  recurso: string;
  metodo: string;
  statusCode?: number;
  duracionMs?: number;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void>

// Registrar cambio de datos
async logDataChange(data: {
  auditLogId?: string;
  tabla: string;
  registroId: string;
  campo: string;
  valorAntes?: string;
  valorDespues?: string;
}): Promise<void>

// Registrar error
async logError(data: {
  usuarioId?: string;
  mensaje: string;
  tipo?: string;
  severidad: ErrorSeveridad;
  stackTrace?: string;
  contexto?: any;
}): Promise<void>

// Comparar objetos y generar resumen de cambios
compararCambios(datosAnteriores: any, datosNuevos: any): any

// Registrar cambios detallados campo por campo
async registrarCambiosDetallados(
  auditLogId: string,
  tabla: string,
  registroId: string,
  datosAnteriores: any,
  datosNuevos: any
): Promise<void>
```

### 2. @Audit Decorator (`src/common/decorators/audit.decorator.ts`)

Decorador para marcar métodos que deben ser auditados.

**Uso:**

```typescript
@Audit({
  accion: TipoAccionEnum.CREATE,
  modulo: 'faqs',
  tabla: 'Faq',
  descripcion: 'Crear nueva pregunta frecuente',
})
async create(inputDto: CreateFaqDto) {
  // ...
}
```

**Interfaz de Metadata:**

```typescript
interface AuditMetadata {
  accion: TipoAccionEnum;
  modulo: string;
  tabla?: string;
  descripcion?: string;
}
```

### 3. AuditInterceptor (`src/common/interceptors/audit.interceptor.ts`)

Interceptor de NestJS que captura automáticamente la ejecución de métodos decorados con `@Audit`.

**Funcionalidades:**

- Extrae contexto del usuario desde JWT (`user.sub`, `user.email`)
- Captura IP del cliente (desde `request.ip` o header `x-forwarded-for`)
- Extrae User Agent del navegador
- Captura datos del request body
- Mide duración de la operación
- Captura respuesta y registra en base de datos
- Maneja errores y los registra en `ErrorLog`
- Para operaciones UPDATE, registra cambios campo por campo en `DataChangeLog`

**Características:**

- **No bloquea el flujo principal**: Todos los registros se hacen con `await` pero envueltos en try-catch
- **Genera descripciones automáticas**: Si no se proporciona descripción, genera una basada en la acción
- **Tracking de cambios**: Compara `datosAnteriores` vs `datosNuevos` y genera resumen JSON

### 4. LogsModule (`src/modules/admin/logs/`)

Módulo de administración para consultar logs.

**Endpoints:**

```typescript
// Listar logs de auditoría con filtros
GET /admin/logs/audit?
  usuarioId=uuid&
  accion=CREATE&
  modulo=faqs&
  tabla=Faq&
  fechaDesde=2024-01-01&
  fechaHasta=2024-12-31&
  limite=20&
  pagina=1

// Obtener estadísticas de auditoría
GET /admin/logs/audit/stats

// Listar logs del sistema
GET /admin/logs/system?
  nivel=ERROR&
  mensaje=string&
  limite=20&
  pagina=1

// Listar intentos de login
GET /admin/logs/login-attempts?
  usuarioId=uuid&
  email=user@example.com&
  exito=false&
  esSospechoso=true&
  limite=20&
  pagina=1

// Listar logs de errores
GET /admin/logs/errors?
  usuarioId=uuid&
  severidad=CRITICAL&
  resuelto=false&
  limite=20&
  pagina=1

// Listar logs de acceso HTTP
GET /admin/logs/access?
  usuarioId=uuid&
  recurso=/api/faqs&
  metodo=POST&
  limite=20&
  pagina=1

// Obtener historial de cambios de un registro específico
GET /admin/logs/data-changes/:tabla/:registroId
```

**DTOs de Respuesta:**

```typescript
interface AuditLogStats {
  totalAcciones: number;
  accionesPorTipo: { accion: string; cantidad: number }[];
  modulosMasActivos: { modulo: string; cantidad: number }[];
  usuariosMasActivos: { usuarioId: string; cantidad: number }[];
  accionesPorDia: { fecha: string; cantidad: number }[];
}

interface DataChangeHistory {
  tabla: string;
  registroId: string;
  cambios: Array<{
    campo: string;
    valorAntes: string;
    valorDespues: string;
    creadoEn: Date;
    auditLog?: {
      usuarioId: string;
      descripcion: string;
      ipAddress: string;
    };
  }>;
}
```

## Integración en Módulos

### Paso 1: Agregar Imports

```typescript
import { UseInterceptors } from '@nestjs/common';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '@/generated/prisma';
```

### Paso 2: Aplicar Interceptor al Controller

```typescript
@Controller('faqs')
@UseInterceptors(AuditInterceptor)
export class FaqController {
  // ...
}
```

### Paso 3: Decorar Métodos

```typescript
@Post()
@Audit({
  accion: TipoAccionEnum.CREATE,
  modulo: 'faqs',
  tabla: 'Faq',
  descripcion: 'Crear nueva FAQ',
})
async create(@Body() inputDto: CreateFaqDto) {
  return this.faqService.create(inputDto);
}

@Patch(':id')
@Audit({
  accion: TipoAccionEnum.UPDATE,
  modulo: 'faqs',
  tabla: 'Faq',
  descripcion: 'Actualizar FAQ',
})
async update(@Param('id') id: string, @Body() inputDto: UpdateFaqDto) {
  return this.faqService.update(id, inputDto);
}

@Delete(':id')
@Audit({
  accion: TipoAccionEnum.DELETE,
  modulo: 'faqs',
  tabla: 'Faq',
  descripcion: 'Eliminar FAQ',
})
async remove(@Param('id') id: string) {
  return this.faqService.remove(id);
}
```

## Integración Manual (Sin Decoradores)

Para casos donde necesitas logging manual (como en el AuthService):

```typescript
// En el constructor
constructor(
  private readonly auditService: AuditService,
) {}

// Registrar login exitoso
await this.auditService.logLoginAttempt({
  usuarioId: user.id,
  email: user.email,
  exito: true,
  ipAddress,
  userAgent,
  dispositivoConfianza: true,
});

await this.auditService.logAudit({
  usuarioId: user.id,
  accion: TipoAccionEnum.LOGIN,
  modulo: 'auth',
  tabla: 'Usuario',
  registroId: user.id,
  descripcion: `Usuario ${user.email} inició sesión`,
  ipAddress,
  userAgent,
});

// Registrar login fallido
await this.auditService.logLoginAttempt({
  usuarioId: user.id,
  email: user.email,
  exito: false,
  motivoFallo: 'Contraseña incorrecta',
  ipAddress,
  userAgent,
  esSospechoso: false,
});

// Registrar logout
await this.auditService.logAudit({
  usuarioId: user.id,
  accion: TipoAccionEnum.LOGOUT,
  modulo: 'auth',
  tabla: 'Usuario',
  registroId: user.id,
  descripcion: `Usuario ${user.email} cerró sesión`,
});

// Registrar error
await this.auditService.logError({
  usuarioId: user.id,
  mensaje: 'Error al procesar solicitud',
  tipo: 'ValidationError',
  severidad: ErrorSeveridad.MEDIUM,
  stackTrace: error.stack,
  contexto: { inputDto },
});
```

## Permisos

Se agregaron dos nuevos permisos en `PermisoEnum`:

```typescript
enum PermisoEnum {
  // ... permisos existentes
  LOGS_VER = 'logs:ver',
  LOGS_EXPORTAR = 'logs:exportar',
}
```

## Módulos Integrados

### ✅ Completados

1. **FAQ Module** (`src/modules/admin/faqs/`)
   - ✅ CREATE
   - ✅ UPDATE con tracking de cambios
   - ✅ DELETE

2. **Auth Service** (`src/modules/auth/auth.service.ts`)
   - ✅ LOGIN (exitoso y fallido)
   - ✅ LOGOUT
   - ✅ Verificación 2FA (exitosa y fallida)
   - ✅ Email no verificado
   - ✅ Usuario inactivo
   - ✅ Contraseña incorrecta

3. **Categorias Module** (`src/modules/admin/catalogos/categorias/`)
   - ✅ CREATE
   - ✅ UPDATE
   - ✅ DELETE

4. **Usuarios Module** (`src/modules/admin/security/usuarios/`)
   - ✅ CREATE
   - ✅ UPDATE
   - ✅ DELETE
   - ✅ PASSWORD_CHANGE

## Testing

Utiliza el archivo `test/audit-system-test.http` para probar todos los endpoints.

### Pruebas Básicas

1. **Login exitoso**: Verifica que se registre en `logs_login_attempts` con `exito=true`
2. **Login fallido**: Verifica que se registre con `exito=false` y `motivoFallo`
3. **Crear FAQ**: Verifica que se cree registro en `logs_audit_logs` con `accion=CREATE`
4. **Actualizar FAQ**: Verifica que se cree registro con `accion=UPDATE`, `datosAnteriores`, `datosNuevos` y entradas en `logs_data_change_logs`
5. **Eliminar FAQ**: Verifica que se registre con `accion=DELETE`
6. **Consultar logs**: Verifica que los filtros funcionen correctamente

### Verificación en Base de Datos

```sql
-- Ver últimos logs de auditoría
SELECT * FROM logs_audit_logs ORDER BY "creadoEn" DESC LIMIT 10;

-- Ver intentos de login fallidos
SELECT * FROM logs_login_attempts WHERE exito = false ORDER BY "creadoEn" DESC;

-- Ver cambios detallados de un registro
SELECT * FROM logs_data_change_logs WHERE "registroId" = 'UUID_AQUI';

-- Ver errores no resueltos
SELECT * FROM logs_error_logs WHERE resuelto = false ORDER BY severidad DESC;

-- Estadísticas por acción
SELECT accion, COUNT(*) as cantidad 
FROM logs_audit_logs 
GROUP BY accion 
ORDER BY cantidad DESC;

-- Usuarios más activos
SELECT "usuarioId", COUNT(*) as acciones 
FROM logs_audit_logs 
WHERE "usuarioId" IS NOT NULL 
GROUP BY "usuarioId" 
ORDER BY acciones DESC 
LIMIT 10;
```

## Características Destacadas

### 1. No Invasivo
El sistema no afecta el flujo normal de la aplicación. Si falla el registro de auditoría, la operación principal continúa.

### 2. Comparación Automática de Cambios
Para operaciones UPDATE, el sistema compara automáticamente los datos anteriores con los nuevos y genera:
- Resumen JSON con solo los campos modificados
- Registros detallados campo por campo en `DataChangeLog`

### 3. Métricas de Rendimiento
Captura la duración de cada operación en milisegundos.

### 4. Contexto Completo
Registra:
- Usuario que realizó la acción
- IP del cliente
- User Agent del navegador
- Fecha y hora exacta
- Datos antes y después del cambio

### 5. Seguridad
- Tracking de intentos de login sospechosos
- Registro de accesos fallidos
- Historial completo de cambios de contraseña

### 6. Trazabilidad Total
Permite responder preguntas como:
- ¿Quién cambió este registro?
- ¿Cuándo se modificó?
- ¿Qué campos cambiaron exactamente?
- ¿Cuál era el valor anterior?
- ¿Desde qué IP se hizo el cambio?

## Mejoras Futuras

1. **Exportación de Logs**: Implementar endpoint para exportar logs a CSV/Excel
2. **Alertas Automáticas**: Notificar administradores sobre actividad sospechosa
3. **Retención de Datos**: Implementar política de limpieza automática de logs antiguos
4. **Dashboard Visual**: Crear frontend para visualizar estadísticas de auditoría
5. **Búsqueda Avanzada**: Implementar búsqueda full-text en logs
6. **Restauración de Datos**: Permitir restaurar valores anteriores desde el historial
7. **Compliance Reports**: Generar reportes automáticos para auditorías de seguridad

## Conclusión

El sistema de auditoría implementado proporciona una solución completa y robusta para el tracking de todas las operaciones críticas en la aplicación. Es fácil de integrar en módulos existentes y nuevos mediante decoradores, y ofrece capacidades avanzadas de consulta y análisis de datos históricos.
