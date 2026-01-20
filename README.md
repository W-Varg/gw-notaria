<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 📋 Sistema de Gestión de Notaría - Backend

> Sistema integral de gestión para notarías que permite administrar servicios notariales, derivaciones entre funcionarios, clientes, documentos, pagos y auditoría completa.

## 📖 Descripción del Proyecto

Sistema backend https://gw-notaria-he2jg5hhe-w-vargs-projects.vercel.app  desarrollado para una **notaría** que ofrece múltiples **servicios notariales** (trámites) a sus clientes. El sistema gestiona el ciclo de vida completo de cada servicio desde su inicio hasta su finalización, permitiendo:

- **Gestión de Servicios**: Cada servicio (trámite notarial) es iniciado por un funcionario y puede involucrar múltiples documentos y requisitos.
- **Sistema de Derivaciones**: Los servicios pueden ser derivados entre funcionarios según especialización, carga de trabajo o disponibilidad.
- **Flujo de Aceptación/Rechazo**: Los funcionarios pueden aceptar o rechazar derivaciones con notificaciones automáticas.
- **Seguimiento de Estados**: Control completo del estado de cada servicio con historial de cambios.
- **Gestión de Responsables**: Múltiples funcionarios pueden ser asignados a un servicio con fechas de asignación y baja.
- **Sistema de Notificaciones**: Notificaciones en tiempo real para derivaciones, cambios de estado y eventos importantes.

## 🏗️ Arquitectura del Negocio

### Entidades Principales

```
Cliente (Persona Natural/Jurídica)
    ↓
Servicio (Trámite Notarial)
    ↓ gestiona
TipoTramite → TipoDocumento
    ↓ tiene
EstadoTramite (Workflow)
    ↓ involucra
ResponsableServicio (Funcionarios asignados)
    ↓ puede ser derivado
DerivacionServicio (Transferencia entre funcionarios)
    ↓ genera
Notificaciones
```

### Flujo de Trabajo de Servicios

1. **Creación**: Un funcionario crea un servicio para un cliente, especificando el tipo de trámite
2. **Asignación**: Se asigna automáticamente el funcionario creador como responsable inicial
3. **Derivación** (opcional): El responsable puede derivar el servicio a otro funcionario
   - El funcionario destino recibe una notificación
   - Puede aceptar (se convierte en responsable) o rechazar la derivación
4. **Seguimiento**: El servicio pasa por diferentes estados hasta su finalización
5. **Pagos**: Se registran pagos e ingresos asociados al servicio
6. **Finalización**: El servicio se marca como finalizado con fecha de cierre

## 🚀 Stack Tecnológico

### Core Framework
- **NestJS 11.1.9** - Framework backend progresivo para Node.js
- **TypeScript 5.9.3** - Tipado estático y features modernas de JavaScript
- **Node.js 20+** - Runtime de JavaScript

### Base de Datos
- **PostgreSQL** - Base de datos relacional principal
- **Prisma ORM 7.2.0** - ORM moderno con typesafety completo
  - 2 schemas: `public` (datos de aplicación) y `logs` (auditoría)
  - Migraciones versionadas
  - Generación de tipos TypeScript automática

### Autenticación & Seguridad
- **JWT (jsonwebtoken)** - Tokens de autenticación
- **bcrypt** - Hash de contraseñas
- **Passport** - Estrategias de autenticación
- **Google OAuth 2.0** - Login con Google
- **2FA (speakeasy + qrcode)** - Autenticación de dos factores
- **Trusted Devices** - Sistema de dispositivos confiables

### Validación & Transformación
- **class-validator** - Validación de DTOs con decoradores
- **class-transformer** - Transformación de objetos
- **Pipes personalizados** - Validación de inputs y formateo

### Documentación
- **Swagger/OpenAPI** - Documentación interactiva de API
  - DTOs completamente documentados
  - Tipos de respuesta tipados
  - Autenticación Bearer Token

### Comunicaciones
- **Nodemailer** - Envío de emails transaccionales
- **Gmail SMTP** - Servicio de email
- **Plantillas HTML** - Emails personalizados y profesionales

### Utilidades
- **dayjs** - Manejo de fechas y zonas horarias
- **commitlint** - Validación de commits convencionales
- **ESLint** - Linter para código TypeScript

## ✨ Características Principales

### 🔐 Sistema de Autenticación Completo
- Registro de usuarios con verificación de email
- Login con email/contraseña
- Google OAuth integrado
- 2FA con Google Authenticator
- Sistema de tokens JWT con refresh tokens
- Dispositivos confiables (bypass 2FA)
- Recuperación de contraseña vía email
- Control de sesiones activas

### 📧 Sistema de Emails Profesional
- Email de verificación de registro
- Email de bienvenida post-verificación
- Email de recuperación de contraseña
- Email de confirmación de 2FA
- Plantillas HTML responsivas
- Configuración vía Gmail App Passwords

**Documentación completa:** [docs/EMAIL_SYSTEM.md](docs/EMAIL_SYSTEM.md)

### 🗂️ Gestión de Servicios Notariales
- CRUD completo de servicios (trámites)
- Tipos de trámites configurables con costos base
- Estados de trámites personalizables
- Historial completo de cambios de estado
- Asignación de múltiples responsables
- Gestión de plazos y fechas estimadas
- Sistema de prioridades (baja, normal, alta, urgente)
- Tracking de montos y saldos pendientes

### 🔄 Sistema de Derivaciones
- Derivar servicios entre funcionarios
- Motivos y comentarios de derivación
- Flujo de aceptación/rechazo
- Notificaciones automáticas
- Historial completo de derivaciones por servicio
- Filtros avanzados para super admin:
  - Por funcionario (origen/destino)
  - Por rango de fechas
  - Por tipo de trámite
  - Por estado de aceptación
  - Por prioridad
- Consultas especializadas:
  - Mis derivaciones pendientes
  - Mis derivaciones enviadas
  - Derivaciones por servicio

**Documentación completa:** [src/modules/admin/servicios/derivaciones/README.md](src/modules/admin/servicios/derivaciones/README.md)

### 👥 Gestión de Clientes
- Personas naturales y jurídicas
- Datos completos de contacto
- Historial de servicios contratados
- Búsqueda avanzada

### 📄 Gestión de Documentos
- Catálogo de tipos de documentos
- Tipos de trámites asociados
- Clasificación y organización

### 💰 Sistema de Pagos e Ingresos
- Registro de pagos por servicio
- Múltiples métodos de pago
- Cuentas bancarias
- Constancias y comprobantes
- Control de saldos

### 📊 Auditoría y Logs
- Schema separado `logs` en PostgreSQL
- Registro automático de todas las operaciones
- Decorador `@Audit` para tracking
- Información de usuario, IP, user agent
- Cambios antes/después en actualizaciones
- Queries ejecutados
- Timestamps precisos con zona horaria

**Documentación completa:** [AUDIT_SYSTEM.md](AUDIT_SYSTEM.md)

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Tipos: info, success, warning, error
- Iconos y rutas personalizables
- Marcar como leída/no leída
- Filtrado por usuario
- Limpieza automática de antiguas

### 🎯 Sistema de Permisos
- Control granular por módulo
- Permisos: VER, CREAR, EDITAR, ELIMINAR
- Decorador `@BearerAuthPermision`
- Validación automática en endpoints

## 📁 Estructura del Proyecto

```
backend-ntr/
├── prisma/
│   ├── schema.prisma              # Schema de Prisma con 2 schemas (public, logs)
│   ├── migrations/                # Migraciones versionadas
│   └── seed/                      # Seeds para datos iniciales
├── src/
│   ├── main.ts                    # Entry point de la aplicación
│   ├── app.module.ts              # Módulo raíz
│   ├── common/                    # Código compartido
│   │   ├── configurations/        # Configuraciones (DB, Auth, Email)
│   │   ├── decorators/            # Decoradores personalizados
│   │   │   ├── authorization.decorator.ts  # @BearerAuthPermision
│   │   │   ├── audit.decorator.ts          # @Audit
│   │   │   ├── token.decorator.ts          # @AuthUser
│   │   │   └── controller.decorator.ts     # @ApiDescription
│   │   ├── dtos/                  # DTOs base y comunes
│   │   │   ├── response.dto.ts    # Estructura de respuestas HTTP
│   │   │   ├── filters.dto.ts     # DTOs de filtros y paginación
│   │   │   └── prisma/            # Filtros de Prisma (StringFilter, etc)
│   │   ├── filters/               # Exception filters
│   │   ├── guards/                # Guards (Auth, Permissions)
│   │   ├── interceptors/          # Interceptors
│   │   │   └── audit.interceptor.ts  # Interceptor de auditoría
│   │   └── pipes/                 # Validation pipes
│   ├── enums/                     # Enums de la aplicación
│   │   └── permisos.enum.ts       # Enum de permisos
│   ├── generated/                 # Código generado por Prisma
│   │   └── prisma/                # Prisma Client
│   ├── global/                    # Módulos globales
│   │   ├── database/              # DatabaseService (Prisma wrapper)
│   │   ├── emails/                # EmailService y plantillas
│   │   └── services/              # Servicios globales
│   ├── helpers/                   # Funciones helper
│   │   ├── cors.helpers.ts
│   │   └── prisma.helper.ts       # Formateo de paginación
│   └── modules/                   # Módulos de la aplicación
│       ├── auth/                  # Autenticación y autorización
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/        # Passport strategies
│       │   └── dto/
│       ├── public/                # Endpoints públicos (sin auth)
│       └── admin/                 # Endpoints administrativos
│           ├── catalogos/         # Catálogos del sistema
│           │   ├── tipos-tramite/
│           │   ├── tipos-documento/
│           │   ├── estados-tramite/
│           │   └── ...
│           ├── usuarios/          # Gestión de usuarios
│           ├── clientes/          # Gestión de clientes
│           ├── servicios/         # Gestión de servicios
│           │   ├── servicio.controller.ts
│           │   ├── servicio.service.ts
│           │   ├── servicio.entity.ts
│           │   └── derivaciones/  # Módulo de derivaciones
│           │       ├── derivacion.controller.ts
│           │       ├── derivacion.service.ts
│           │       ├── derivacion.entity.ts
│           │       ├── dto/
│           │       │   ├── derivacion.input.dto.ts
│           │       │   └── derivacion.response.ts
│           │       └── README.md
│           ├── pagos-ingresos/    # Pagos e ingresos
│           └── gastos/            # Gastos y egresos
├── test/                          # Tests y archivos .http
│   ├── auth-flow-complete.http    # Flujo completo de autenticación
│   ├── 2fa-test.http              # Tests de 2FA
│   ├── register-test.http         # Tests de registro
│   └── audit-system-test.http     # Tests de auditoría
├── docs/                          # Documentación adicional
├── public/assets/                 # Assets públicos
├── ESTRUCTURA_MODULES.md          # Guía de estructura de módulos
├── AUDIT_SYSTEM.md                # Documentación del sistema de auditoría
└── README.md                      # Este archivo
```

## 🎨 Patrones y Convenciones

### Estructura de Módulos CRUD

Cada módulo CRUD sigue una estructura estándar documentada en [ESTRUCTURA_MODULES.md](ESTRUCTURA_MODULES.md):

```typescript
modules/[categoria]/[nombre]/
├── dto/
│   ├── [nombre].input.dto.ts      # DTOs de entrada (Create, Update, Filter)
│   └── [nombre].response.ts       # DTOs de respuesta tipados
├── [nombre].controller.ts         # Endpoints REST con decoradores
├── [nombre].service.ts            # Lógica de negocio
├── [nombre].entity.ts             # Entidades para Swagger
├── [nombre].module.ts             # Módulo NestJS
└── README.md                      # Documentación del módulo
```

### Respuestas HTTP Estandarizadas

Todas las respuestas siguen un formato consistente:

```typescript
{
  "error": false,
  "message": "Operación exitosa",
  "response": {
    "data": { ... },           // O array de datos
    "pagination": {            // Solo en endpoints paginados
      "total": 100,
      "page": 1,
      "size": 10,
      "from": 0
    }
  },
  "status": 200
}
```

### Decoradores Personalizados

```typescript
// Controlador
@ApiTags('[admin] Derivaciones')
@Controller('admin/derivaciones')
@UseInterceptors(AuditInterceptor)
export class DerivacionController {
  
  @Post()
  @BearerAuthPermision([PermisoEnum.SERVICIOS_CREAR])
  @ApiDescription('Crear derivación', [PermisoEnum.SERVICIOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseDerivacionType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'servicios',
    tabla: 'DerivacionServicio',
    descripcion: 'Crear derivación de servicio',
  })
  create(@Body() dto: CreateDerivacionDto, @AuthUser() session: IToken) {
    return this.service.create(dto, session);
  }
}
```

## 🛠️ Configuración e Instalación

### Prerrequisitos

- **Node.js 20+**
- **PostgreSQL 14+**
- **pnpm** (recomendado) o npm/yarn

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/notaria_db?schema=public"

# JWT
JWT_SECRET=tu_secret_key_muy_seguro
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_USER=tu.email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación_gmail
EMAIL_SERVICE=gmail

# URLs Frontend
ENV_FRONT_APP_URL=http://localhost:5173

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Configuración de la App
PORT=3000
NODE_ENV=development
```

**Nota sobre Gmail:** Usa una [contraseña de aplicación de Gmail](https://myaccount.google.com/apppasswords), no tu contraseña normal.

### Instalación

```bash
# Instalar dependencias
pnpm install

# O con npm
npm install
```

### Configuración de Base de Datos

```bash
# Generar Prisma Client
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

# Seed de datos iniciales (opcional)
pnpm prisma db seed
```

## 🚀 Ejecución

```bash
# Modo desarrollo (con hot-reload)
pnpm run start:dev

# Modo producción
pnpm run start:prod

# Modo debug
pnpm run start:debug
```

La aplicación estará disponible en `http://localhost:3000`

- **Swagger UI**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

## 🧪 Testing

### Archivos de Prueba HTTP

El proyecto incluye archivos `.http` para probar endpoints con REST Client (VS Code):

```bash
test/
├── auth-flow-complete.http        # Flujo completo: registro → verificación → login
├── 2fa-test.http                  # Pruebas de 2FA con Google Authenticator
├── google-oauth-test.http         # Pruebas de Google OAuth
├── register-test.http             # Pruebas de registro y verificación
├── audit-system-test.http         # Pruebas del sistema de auditoría
└── usuarios.service.http          # Pruebas de gestión de usuarios
```

### Tests Unitarios y E2E

```bash
# Tests unitarios
pnpm run test

# Tests e2e
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## 📊 Base de Datos (Prisma)

### Schemas

El proyecto utiliza **2 schemas de PostgreSQL**:

1. **`public`**: Datos de la aplicación (usuarios, servicios, clientes, etc.)
2. **`logs`**: Sistema de auditoría (logs de operaciones)

### Comandos Útiles de Prisma

```bash
# Generar Prisma Client
pnpm prisma generate

# Crear migración
pnpm prisma migrate dev --name descripcion_cambio

# Aplicar migraciones en producción
pnpm prisma migrate deploy

# Abrir Prisma Studio (UI para ver datos)
pnpm prisma studio

# Reset de base de datos (¡CUIDADO!)
pnpm prisma migrate reset

# Ver estado de migraciones
pnpm prisma migrate status

# Seed
pnpm prisma db seed
```

### Modelos Principales

```prisma
// Usuario del sistema
model Usuario {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String?
  nombre      String
  apellidos   String
  estaActivo  Boolean  @default(true)
  // ... relaciones con Servicio, DerivacionServicio, etc.
}

// Cliente (puede ser persona natural o jurídica)
model Cliente {
  id                String             @id @default(cuid())
  tipoCliente       TipoClienteEnum
  personaNatural    PersonaNatural?
  personaJuridica   PersonaJuridica?
  servicios         Servicio[]
}

// Servicio notarial (trámite)
model Servicio {
  id                     String                 @id @default(cuid())
  codigoTicket           String                 @unique
  clienteId              String
  tipoTramiteId          String
  estadoActualId         String?
  fechaInicio            DateTime               @default(now())
  fechaFinalizacion      DateTime?
  prioridad              String                 @default("normal")
  montoTotal             Decimal
  saldoPendiente         Decimal
  
  // Relaciones
  cliente                Cliente                @relation(...)
  tipoTramite            TipoTramite            @relation(...)
  estadoActual           EstadoTramite?         @relation(...)
  responsablesServicio   ResponsableServicio[]
  derivaciones           DerivacionServicio[]
  pagosIngresos          PagosIngresos[]
}

// Derivación de servicio entre funcionarios
model DerivacionServicio {
  id               Int      @id @default(autoincrement())
  servicioId       String
  usuarioOrigenId  String
  usuarioDestinoId String
  fechaDerivacion  DateTime @default(now())
  motivo           String?
  prioridad        String   @default("normal")
  aceptada         Boolean  @default(false)
  fechaAceptacion  DateTime?
  
  servicio         Servicio @relation(...)
  usuarioOrigen    Usuario  @relation("DerivacionesOrigen", ...)
  usuarioDestino   Usuario  @relation("DerivacionesDestino", ...)
}
```

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

1. **Registro** → Envío de email de verificación
2. **Verificación** → Click en link del email
3. **Login** → JWT Token + Refresh Token
4. **2FA** (opcional) → Código de Google Authenticator
5. **Dispositivos Confiables** → Bypass 2FA en dispositivos conocidos

### Uso de Tokens

```typescript
// Headers de autenticación
Authorization: Bearer <jwt_token>

// El token incluye:
{
  usuarioId: string,
  email: string,
  nombreCompleto: string,
  estaActivo: boolean,
  iat: number,
  exp: number
}
```

### Sistema de Permisos

Los permisos se definen en `src/enums/permisos.enum.ts`:

```typescript
export enum PermisoEnum {
  // Servicios
  SERVICIOS_VER = 'servicios:ver',
  SERVICIOS_CREAR = 'servicios:crear',
  SERVICIOS_EDITAR = 'servicios:editar',
  SERVICIOS_ELIMINAR = 'servicios:eliminar',
  
  // Derivaciones
  DERIVACIONES_VER = 'derivaciones:ver',
  DERIVACIONES_CREAR = 'derivaciones:crear',
  // ...
}
```

## 📚 Documentación Adicional

- **[ESTRUCTURA_MODULES.md](ESTRUCTURA_MODULES.md)**: Guía completa para crear módulos CRUD siguiendo los patrones del proyecto
- **[AUDIT_SYSTEM.md](AUDIT_SYSTEM.md)**: Documentación del sistema de auditoría y logs
- **[docs/EMAIL_SYSTEM.md](docs/EMAIL_SYSTEM.md)**: Sistema de emails y plantillas
- **[src/modules/admin/servicios/derivaciones/README.md](src/modules/admin/servicios/derivaciones/README.md)**: Documentación del módulo de derivaciones

## 🎯 Casos de Uso Principales

### Crear un Servicio

```typescript
POST /admin/servicios
Authorization: Bearer <token>

{
  "clienteId": "clxxx",
  "tipoDocumentoId": "doc123",
  "tipoTramiteId": "tramite456",
  "observaciones": "Trámite urgente",
  "prioridad": "alta",
  "plazoEntregaDias": 5
}
```

### Derivar un Servicio

```typescript
POST /admin/derivaciones
Authorization: Bearer <token>

{
  "servicioId": "srv123",
  "usuarioDestinoId": "usr456",
  "motivo": "Especialización en el área",
  "prioridad": "alta",
  "comentario": "Requiere experiencia en trámites internacionales"
}
```

### Aceptar una Derivación

```typescript
PATCH /admin/derivaciones/:id/aceptar
Authorization: Bearer <token>

{
  "comentario": "Acepto el servicio, lo atenderé hoy"
}
```

### Listar Derivaciones con Filtros (Super Admin)

```typescript
POST /admin/derivaciones/list
Authorization: Bearer <token>

{
  "where": {
    "fechaDerivacion": {
      "gte": "2026-01-01T00:00:00.000Z",
      "lte": "2026-01-31T23:59:59.999Z"
    },
    "tramiteId": "tipo_tramite_123",
    "aceptada": { "equals": false },
    "prioridad": "alta"
  },
  "page": 1,
  "size": 20
}
```

## 🚢 Deployment

### Variables de Entorno en Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=super_secret_production_key
ENV_FRONT_APP_URL=https://notaria.example.com
PORT=3000
```

### Build para Producción

```bash
# Build
pnpm run build

# Start
pnpm run start:prod
```

### Docker (Ejemplo)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
```

## 🤝 Contribución

### Commits Convencionales

El proyecto usa **commitlint** para validar commits:

```bash
feat: agregar endpoint de exportación de servicios
fix: corregir validación de fechas en derivaciones
docs: actualizar README con ejemplos de uso
refactor: mejorar estructura de módulo de pagos
test: agregar tests para sistema de notificaciones
```

### Workflow de Desarrollo

1. Crear rama desde `main`: `git checkout -b feature/nueva-funcionalidad`
2. Realizar cambios siguiendo patrones en [ESTRUCTURA_MODULES.md](ESTRUCTURA_MODULES.md)
3. Commit con mensaje convencional
4. Push y crear Pull Request
5. Code review y merge

## 📄 Licencia

Este proyecto es propietario y confidencial.
