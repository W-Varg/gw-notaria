# 📚 Guía de Estructura de Módulos - Backend NestJS

Esta guía documenta la estructura estándar para crear módulos CRUD en el proyecto, basada en el módulo de **Categorías** como referencia.

---

## 📋 Tabla de Contenidos

1. [Estructura de Archivos](#estructura-de-archivos)
2. [DTOs de Entrada (Input)](#dtos-de-entrada-input)
3. [DTOs de Respuesta (Response)](#dtos-de-respuesta-response)
4. [Controlador (Controller)](#controlador-controller)
5. [Convenciones de Nombres](#convenciones-de-nombres)
6. [Ejemplos Completos](#ejemplos-completos)

---

## 🗂️ Estructura de Archivos

Cada módulo debe seguir esta estructura:

```
src/modules/admin/catalogos/[nombre-modulo]/
├── dto/
│   ├── [nombre].input.dto.ts      # DTOs de entrada (Create, Update)
│   ├── [nombre].where.input.ts    # DTOs de filtros (WhereInput, SelectInput, ListArgsDto)
│   └── [nombre].response.ts       # DTOs de respuesta (tipos de retorno)
├── [nombre].controller.ts         # Controlador con endpoints
├── [nombre].service.ts            # Lógica de negocio
├── [nombre].entity.ts             # Entidades para Swagger
├── [nombre].module.ts             # Módulo NestJS
└── README.md                      # Documentación del módulo
```

**Nota sobre separación de archivos:**
- `[nombre].input.dto.ts`: Contiene solo `CreateDto` y `UpdateDto`
- `[nombre].where.input.ts`: Contiene `WhereInput`, `SelectInput` y `ListArgsDto` (filtros)
- Esta separación mejora la organización y mantiene los archivos más pequeños y enfocados

---

## 📥 DTOs de Entrada (Input)

### Archivo: `[nombre].input.dto.ts`

Este archivo contiene los DTOs para crear y actualizar registros del módulo.

### 1️⃣ CreateDto - DTO de Creación

```typescript
export class CreateTipoTramiteDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'ID del tipo de documento (opcional)' })
  tipoDocumentoId?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ type: String })
  nombre: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({ type: String })
  claseTramite?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, description: 'Costo base del trámite' })
  costoBase?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, default: true })
  estaActiva?: boolean;
}
```

**Decoradores importantes:**
- `@Expose()`: Permite la serialización del campo (siempre al inicio de cada propiedad)
- `@IsDefined()`: Campo obligatorio
- `@IsOptional()`: Campo opcional
- `@IsString()`, `@IsBoolean()`, `@IsNumber()`: Validación de tipo
- `@MinLength()`, `@MaxLength()`: Validación de longitud
- `@ApiProperty()`: Documentación Swagger (requerido)
- `@ApiPropertyOptional()`: Documentación Swagger (opcional)

**Nota sobre campos opcionales:**
- En Prisma, un campo con `?` es nullable en la base de datos
- En DTOs de creación, usa `@IsOptional()` para campos no requeridos
- Ejemplo: `tipoDocumentoId String?` en schema → `tipoDocumentoId?: string` con `@IsOptional()` en DTO

**Orden de decoradores:**
1. `@Expose()` - Siempre primero
2. Validación (`@IsDefined()` o `@IsOptional()`)
3. Validaciones de tipo (`@IsString()`, `@IsBoolean()`, etc.)
4. Validaciones específicas (`@MinLength()`, `@MaxLength()`, etc.)
5. Swagger (`@ApiProperty()` o `@ApiPropertyOptional()`) - Siempre antes de la declaración

### 2️⃣ UpdateDto - DTO de Actualización

```typescript
export class Update[Nombre]Dto extends PartialType(Create[Nombre]Dto) {
  // Todos los campos de Create son opcionales automáticamente
  // Agregar campos adicionales solo si es necesario
  
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActivo?: boolean;
}
```

**Nota:** `PartialType` convierte automáticamente todos los campos del DTO base en opcionales.

---

### Archivo: `[nombre].where.input.ts`

Este archivo contiene los DTOs para filtrado, selección de campos y listado paginado.

### 3️⃣ WhereInput - DTO de Filtros

```typescript
class [Nombre]WhereInput {
  // Filtros para strings
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  // Filtros para strings nullable
  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  descripcion?: StringNullableFilter;

  // Filtros para booleanos
  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActiva?: BoolFilter;

  // Filtros para números
  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  cantidad?: IntFilter;

  // Filtros para números decimales (Prisma Decimal)
  @Expose()
  @ApiPropertyOptional({ type: DecimalFilter })
  @IsOptional()
  @Type(() => DecimalFilter)
  costoBase?: DecimalFilter;

  // Filtros para fechas
  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCreacion?: DateTimeFilter;

  // Filtros para fechas opcionales (nullable)
  @Expose()
  @ApiPropertyOptional({ type: DateTimeNullableFilter })
  @IsOptional()
  @Type(() => DateTimeNullableFilter)
  fechaFinalizacion?: DateTimeNullableFilter;
}
```

**Orden de decoradores en WhereInput:**
1. `@Expose()` - Siempre primero
2. `@ApiPropertyOptional({ type: TipoFiltro })` - Documentación Swagger
3. `@IsOptional()` - Todos los filtros son opcionales
4. `@Type(() => TipoFiltro)` - Transformación de tipo

**Tipos de filtros disponibles:**
- `StringFilter`: Para campos `string` (required)
- `StringNullableFilter`: Para campos `string | null` (optional)
- `IntFilter`: Para campos `number` (enteros)
- `FloatFilter`: Para campos `number` (decimales)
- `DecimalFilter`: Para campos `Decimal` de Prisma
- `BoolFilter`: Para campos `boolean`
- `DateTimeFilter`: Para campos `Date` / `DateTime`
- `DateTimeNullableFilter`: Para campos `DateTime?` (optional)

### 4️⃣ SelectInput - DTO de Selección de Campos

```typescript
class [Nombre]SelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  descripcion?: boolean;

  // Agregar todos los campos del modelo
}
```

### 5️⃣ ListArgsDto - DTO de Listado con Filtros

```typescript
export class List[Nombre]ArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: [Nombre]WhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => [Nombre]WhereInput)
  where?: [Nombre]WhereInput;

  @Expose()
  @ApiPropertyOptional({ type: [Nombre]SelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => [Nombre]SelectInput)
  select?: [Nombre]SelectInput;
}
```

### 6️⃣ Filtros en Relaciones

Cuando necesitas filtrar por campos de relaciones (ej: filtrar derivaciones por tipo de trámite del servicio):

```typescript
class DerivacionWhereInput {
  // Filtros directos
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  servicioId?: StringFilter;

  // Filtro simple por ID de relación (recomendado)
  @Expose()
  @ApiPropertyOptional({ type: String, description: 'Filtrar por ID del tipo de trámite del servicio' })
  @IsOptional()
  @IsString()
  tramiteId?: string;
}
```

**En el servicio, aplica el filtro así:**
```typescript
if (tramiteId) {
  whereInput.servicio = {
    tipoTramiteId: tramiteId,
  };
}
```

**Nota:** `BaseFilterDto` incluye automáticamente:
- `page`, `limit`: Paginación
- `orderBy`: Ordenamiento
- `search`: Búsqueda global

---

## 📤 DTOs de Respuesta (Response)

### Archivo: `[nombre].response.ts`

Este archivo define los tipos de respuesta para cada endpoint del controlador.

### Estructura de Respuestas

Todas las respuestas siguen este patrón:

```typescript
export class Response[Tipo]Type extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: [Data]Data })
  declare response: [Data]Data;
}
```

### 1️⃣ Respuesta Individual - `Response[Nombre]Type`

Para endpoints que retornan un solo registro (create, findOne, update):

```typescript
class [Nombre]Data extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: [Nombre] })
  data: [Nombre];
}

export class Response[Nombre]Type extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: [Nombre]Data })
  declare response: [Nombre]Data;
}
```

**Estructura de respuesta HTTP:**
```json
{
  "error": false,
  "message": "Operación exitosa",
  "response": {
    "data": {
      "id": "uuid",
      "nombre": "Categoría 1",
      "descripcion": "Descripción",
      "estaActiva": true
    }
  },
  "status": 200
}
```

### 2️⃣ Respuesta Detallada - `Response[Nombre]DetailType`

Para endpoints que retornan un registro con relaciones (findOne con includes):

```typescript
class [Nombre]DetailData {
  @ApiProperty({ type: [Nombre]Detail })
  data: [Nombre]Detail;
}

export class Response[Nombre]DetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: [Nombre]DetailData })
  declare response: [Nombre]DetailData;
}
```

**Nota:** `[Nombre]Detail` debe estar definido en `[nombre].entity.ts` e incluir las relaciones.

### 3️⃣ Respuesta de Lista Simple - `Response[Nombre]sType`

Para endpoints que retornan una lista sin paginación (findAll):

```typescript
class [Nombre]sData {
  @ApiProperty({ type: [[Nombre]] })
  data?: [Nombre][];
}

export class Response[Nombre]sType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: [Nombre]sData })
  declare response: [Nombre]sData;
}
```

**Estructura de respuesta HTTP:**
```json
{
  "error": false,
  "message": "Listado exitoso",
  "response": {
    "data": [
      { "id": "1", "nombre": "Item 1" },
      { "id": "2", "nombre": "Item 2" }
    ]
  },
  "status": 200
}
```

### 4️⃣ Respuesta de Lista Paginada - `Paginate[Nombre]sType`

Para endpoints que retornan una lista con paginación (filter, list):

```typescript
class Paginate[Nombre]sData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [[Nombre]] })
  data?: [Nombre][];
}

export class Paginate[Nombre]sType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: Paginate[Nombre]sData })
  declare response: Paginate[Nombre]sData;
}
```

**Estructura de respuesta HTTP:**
```json
{
  "error": false,
  "message": "Listado paginado exitoso",
  "response": {
    "data": [
      { "id": "1", "nombre": "Item 1" },
      { "id": "2", "nombre": "Item 2" }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "status": 200
}
```

### Resumen de Tipos de Respuesta

| Tipo | Uso | Incluye Paginación | Ejemplo Endpoint |
|------|-----|-------------------|------------------|
| `Response[Nombre]Type` | Registro individual | ❌ | `POST /`, `GET /:id`, `PATCH /:id` |
| `Response[Nombre]DetailType` | Registro con relaciones | ❌ | `GET /:id` (con includes) |
| `Response[Nombre]sType` | Lista simple | ❌ | `GET /` |
| `Paginate[Nombre]sType` | Lista con paginación | ✅ | `POST /list` |

---

## 🎮 Controlador (Controller)

### Archivo: `[nombre].controller.ts`

### Estructura Básica

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { TipoAccionEnum } from 'src/generated/prisma/enums';

@ApiTags('[admin] [Nombre]s')
@Controller('[nombre]s')
@UseInterceptors(AuditInterceptor)
export class [Nombre]Controller {
  constructor(private readonly [nombre]Service: [Nombre]Service) {}

  // Endpoints aquí...
}
```

**Decoradores importantes del controlador:**
- `@ApiTags('[admin] [Nombre]s')`: Agrupa endpoints en Swagger
- `@Controller('[nombre]s')`: Define la ruta base (en plural)
- `@UseInterceptors(AuditInterceptor)`: Interceptor para auditoría automática
- `@BearerAuthPermision([...])`: Valida permisos del usuario
- `@Audit({...})`: Registra acciones en el log de auditoría (en endpoints que modifican datos)

### 1️⃣ Endpoint CREATE - `POST /`

```typescript
@Post()
@BearerAuthPermision([PermisoEnum.[NOMBRE]_CREAR])
@ApiDescription('Crear un nuevo [nombre]', [PermisoEnum.[NOMBRE]_CREAR])
@ApiResponse({ status: 200, type: () => Response[Nombre]Type })
@Audit({
  accion: TipoAccionEnum.CREATE,
  modulo: '[modulo]',
  tabla: '[Nombre]',
  descripcion: 'Crear nuevo [nombre]',
})
create(@Body() inputDto: Create[Nombre]Dto, @AuthUser() session: IToken) {
  return this.[nombre]Service.create(inputDto, session);
}
```

**Decoradores:**
- `@Post()`: Define método HTTP POST
- `@BearerAuthPermision([...])`: Valida permiso de creación
- `@ApiDescription(...)`: Documentación Swagger con descripción y permisos
- `@ApiResponse({...})`: Define tipo de respuesta en Swagger
- `@Audit({...})`: Registra la acción de creación en logs
  - `accion`: Tipo de acción (CREATE, UPDATE, DELETE, etc.)
  - `modulo`: Módulo al que pertenece (ej: 'catalogos', 'security', 'servicios')
  - `tabla`: Nombre de la tabla/modelo en Prisma (ej: 'Categoria', 'DerivacionServicio')
  - `descripcion`: Descripción legible de la acción
- `@AuthUser()`: Inyecta sesión del usuario autenticado

**Ejemplo de @Audit en módulo de servicios:**
```typescript
@Audit({
  accion: TipoAccionEnum.CREATE,
  modulo: 'servicios',
  tabla: 'DerivacionServicio',
  descripcion: 'Crear derivación de servicio',
})
```

**Retorna:** `Response[Nombre]Type` (registro individual)

### 2️⃣ Endpoint READ ALL - `GET /`

```typescript
@Get()
@BearerAuthPermision([PermisoEnum.[NOMBRE]_VER])
@ApiDescription('Listar todos los [nombre]s', [PermisoEnum.[NOMBRE]_VER])
@ApiResponse({ status: 200, type: Response[Nombre]sType })
findAll(@Query() query: ListFindAllQueryDto) {
  return this.[nombre]Service.findAll(query);
}
```

**Retorna:** `Response[Nombre]sType` (lista simple)

### 3️⃣ Endpoint READ FILTERED - `POST /list`

```typescript
@Post('list')
@BearerAuthPermision([PermisoEnum.[NOMBRE]_VER])
@ApiDescription('Servicio post con filtros y paginado de [nombre]s', [
  PermisoEnum.[NOMBRE]_VER,
])
@ApiResponse({ status: 200, type: () => Paginate[Nombre]sType })
list(@Body() inputDto: List[Nombre]ArgsDto) {
  return this.[nombre]Service.filter(inputDto);
}
```

**Retorna:** `Paginate[Nombre]sType` (lista paginada)

### 3.5️⃣ Endpoint SELECT (Opcional) - `GET /select`

**Nota importante sobre orden:** Este endpoint debe declararse **ANTES** del `GET /:id` para evitar que Express lo interprete como un parámetro.

```typescript
@Get('select')
@BearerAuthPermision()
@ApiDescription('Obtener [nombre]s para select/dropdown')
@ApiResponse({ status: 200, type: Response[Nombre]sType })
getForSelect() {
  return this.[nombre]Service.getForSelect();
}
```

**Características:**
- Usa `@BearerAuthPermision()` sin permisos específicos (cualquier usuario autenticado puede acceder)
- Retorna solo campos necesarios para selects: `id`, `nombre`, y opcionalmente `abreviacion`
- Filtra solo registros activos (`estaActivo: true` o `estaActiva: true`)
- Ordenado alfabéticamente por nombre

**Implementación en el servicio:**
```typescript
async getForSelect() {
  const list = await this.prismaService.[nombre].findMany({
    where: { estaActiva: true }, // o estaActivo según el modelo
    select: {
      id: true,
      nombre: true,
      // campos adicionales según necesidad
    },
    orderBy: { nombre: 'asc' },
  });

  return dataResponseSuccess({ data: list });
}
```

**Retorna:** `Response[Nombre]sType` (lista simple de registros activos)

### 4️⃣ Endpoint READ ONE - `GET /:id`

```typescript
@Get(':id')
@BearerAuthPermision([PermisoEnum.[NOMBRE]_VER])
@ApiResponse({ status: 200, type: () => Response[Nombre]DetailType })
@ApiDescription('Obtener un [nombre] por ID', [PermisoEnum.[NOMBRE]_VER])
findOne(@Param() params: CommonParamsDto.Id) {
  return this.[nombre]Service.findOne(params.id);
}
```

**Nota sobre parámetros:**
- Se usa `CommonParamsDto.Id` para validación automática del parámetro `id`
- `CommonParamsDto` proporciona validación de tipos (number, string, etc.)
- Elimina la necesidad de usar `ParseIntPipe` o `ParseUUIDPipe` manualmente

**Retorna:** `Response[Nombre]DetailType` (con relaciones)

### 5️⃣ Endpoint UPDATE - `PATCH /:id`

```typescript
@Patch(':id')
@BearerAuthPermision([PermisoEnum.[NOMBRE]_EDITAR])
@ApiResponse({ status: 200, type: () => Response[Nombre]Type })
@ApiDescription('Actualizar un [nombre] por ID', [PermisoEnum.[NOMBRE]_EDITAR])
@Audit({
  accion: TipoAccionEnum.UPDATE,
  modulo: '[modulo]',
  tabla: '[Nombre]',
  descripcion: 'Actualizar [nombre]',
})
update(
  @Param() params: CommonParamsDto.Id,
  @Body() updateDto: Update[Nombre]Dto,
  @AuthUser() session: IToken,
) {
  return this.[nombre]Service.update(params.id, updateDto, session);
}
```

**Retorna:** `Response[Nombre]Type` (registro actualizado)

### 6️⃣ Endpoint DELETE - `DELETE /:id`

```typescript
@Delete(':id')
@BearerAuthPermision([PermisoEnum.[NOMBRE]_ELIMINAR])
@ApiResponse({ status: 200, type: () => Response[Nombre]Type })
@ApiDescription('Eliminar un [nombre] por ID', [PermisoEnum.[NOMBRE]_ELIMINAR])
@Audit({
  accion: TipoAccionEnum.DELETE,
  modulo: '[modulo]',
  tabla: '[Nombre]',
  descripcion: 'Eliminar [nombre]',
})
remove(@Param() params: CommonParamsDto.Id) {
  return this.[nombre]Service.remove(params.id);
}
```

**Retorna:** `Response[Nombre]Type` (registro eliminado)

### Tabla de Mapeo: Endpoint → Response Type

| Método HTTP | Ruta | Operación | Response Type | Service Method | Notas |
|-------------|------|-----------|---------------|----------------|-------|
| `POST` | `/` | Crear | `Response[Nombre]Type` | `create()` | Requiere autenticación y permisos |
| `GET` | `/select` | Select/Dropdown | `Response[Nombre]sType` | `getForSelect()` | Solo autenticación, sin permisos específicos |
| `GET` | `/` | Listar todo | `Response[Nombre]sType` | `findAll()` | Con paginación básica |
| `POST` | `/list` | Listar filtrado | `Paginate[Nombre]sType` | `filter()` | Con filtros avanzados |
| `GET` | `/:id` | Obtener uno | `Response[Nombre]DetailType` | `findOne()` | Puede incluir relaciones |
| `PATCH` | `/:id` | Actualizar | `Response[Nombre]Type` | `update()` | Requiere autenticación y permisos |
| `DELETE` | `/:id` | Eliminar | `Response[Nombre]Type` | `remove()` | Requiere autenticación y permisos |

**Nota sobre orden de endpoints:**
Los endpoints con rutas específicas (como `/select`, `/list`) deben declararse **ANTES** de los endpoints con parámetros dinámicos (como `/:id`), ya que Express evalúa las rutas en el orden en que se declaran.

---

## 📝 Convenciones de Nombres

### 1. Entidades y DTOs

| Concepto | Patrón | Ejemplo |
|----------|--------|---------|
| Entidad Base | `[Nombre]` | `Categoria` |
| Entidad Detallada | `[Nombre]Detail` | `CategoriaDetail` |
| DTO Crear | `Create[Nombre]Dto` | `CreateCategoriaDto` |
| DTO Actualizar | `Update[Nombre]Dto` | `UpdateCategoriaDto` |
| DTO Filtros | `[Nombre]WhereInput` | `CategoriaWhereInput` |
| DTO Selección | `[Nombre]SelectInput` | `CategoriaSelectInput` |
| DTO Lista | `List[Nombre]ArgsDto` | `ListCategoriaArgsDto` |

### 2. Response Types

| Concepto | Patrón | Ejemplo |
|----------|--------|---------|
| Respuesta Individual | `Response[Nombre]Type` | `ResponseCategoriaType` |
| Respuesta Detallada | `Response[Nombre]DetailType` | `ResponseCategoriaDetailType` |
| Respuesta Lista Simple | `Response[Nombre]sType` | `ResponseCategoriasType` |
| Respuesta Lista Paginada | `Paginate[Nombre]sType` | `PaginateCategoriasType` |

### 3. Data Wrappers

| Concepto | Patrón | Ejemplo |
|----------|--------|---------|
| Data Individual | `[Nombre]Data` | `CategoriaData` |
| Data Detallado | `[Nombre]DetailData` | `CategoriaDetailData` |
| Data Lista Simple | `[Nombre]sData` | `CategoriasData` |
| Data Lista Paginada | `Paginate[Nombre]sData` | `PaginateCategoriasData` |

### 4. Archivos

| Concepto | Patrón | Ejemplo |
|----------|--------|---------|
| Controlador | `[nombre].controller.ts` | `categoria.controller.ts` |
| Servicio | `[nombre].service.ts` | `categoria.service.ts` |
| Módulo | `[nombre].module.ts` | `categoria.module.ts` |
| Entidad | `[nombre].entity.ts` | `categoria.entity.ts` |
| Input DTOs | `[nombre].input.dto.ts` | `categoria.input.dto.ts` |
| Where DTOs | `[nombre].where.input.ts` | `categoria.where.input.ts` |
| Response DTOs | `[nombre].response.ts` | `categoria.response.ts` |

**Nota:** 
- Los **nombres de clase** usan **PascalCase**: `CreateCategoriaDto`
- Los **nombres de archivo** usan **kebab-case**: `categoria.input.dto.ts`
- Los **nombres de ruta** usan **plural**: `/categorias`

---

## 🎯 Ejemplo Completo: Módulo de Categorías

A continuación se muestra un ejemplo completo del módulo de Categorías siguiendo todos los estándares documentados:

**Nota sobre tipos Decimal de Prisma:**
- En el schema: `Decimal @db.Decimal(10, 2)`
- En DTOs: Usa `@IsNumber()` y `number` en TypeScript
- Prisma convierte automáticamente entre `Decimal` y `number`
- En filtros: Usa `DecimalFilter` si necesitas comparaciones precisas

### categoria.input.dto.ts

```typescript
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { DecimalFilter } from 'src/common/dtos/prisma/decimal-filter.input';
import { DateTimeFilter, DateTimeNullableFilter } from 'src/common/dtos';

export class CreateCategoriaDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ type: String })
  nombre: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  imagen?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActiva?: boolean;
}

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActivo?: boolean;
}

class CategoriaWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  descripcion?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActiva?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCreacion?: DateTimeFilter;
}

class CategoriaSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  descripcion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  imagen?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActiva?: boolean;
}

export class ListCategoriaArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: CategoriaWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoriaWhereInput)
  where?: CategoriaWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: CategoriaSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoriaSelectInput)
  select?: CategoriaSelectInput;
}
```

### categoria.response.ts

```typescript
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { Categoria } from '../categoria.entity';

// Respuesta individual
class CategoriaData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Categoria })
  data: Categoria;
}

export class ResponseCategoriaType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriaData })
  declare response: CategoriaData;
}

// Respuesta detallada (con relaciones)
export class ResponseCategoriaDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriaData })
  declare response: CategoriaData;
}

// Respuesta lista simple
class CategoriasData {
  @ApiProperty({ type: [Categoria] })
  data?: Categoria[];
}

export class ResponseCategoriasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriasData })
  declare response: CategoriasData;
}

// Respuesta lista paginada
class PaginateCategoriasData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Categoria] })
  data?: Categoria[];
}

export class PaginateCategoriasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateCategoriasData })
  declare response: PaginateCategoriasData;
}
```

### categoria.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { TipoAccionEnum } from 'src/generated/prisma/enums';
import { CommonParamsDto } from 'src/common/dtos/common-params.dto';

@ApiTags('[admin] Categorías')
@Controller('categorias')
@UseInterceptors(AuditInterceptor)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_CREAR])
  @ApiDescription('Crear una nueva categoría', [PermisoEnum.CATEGORIAS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'catalogos',
    tabla: 'Categoria',
    descripcion: 'Crear nueva categoría',
  })
  create(@Body() inputDto: CreateCategoriaDto, @AuthUser() session: IToken) {
    return this.categoriaService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_VER])
  @ApiDescription('Listar todas las categorías', [PermisoEnum.CATEGORIAS_VER])
  @ApiResponse({ status: 200, type: ResponseCategoriasType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.categoriaService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_VER])
  @ApiDescription('Servicio post con filtros y paginado de categorías', [
    PermisoEnum.CATEGORIAS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateCategoriasType })
  list(@Body() inputDto: ListCategoriaArgsDto) {
    return this.categoriaService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_VER])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaDetailType })
  @ApiDescription('Obtener una categoría por ID', [PermisoEnum.CATEGORIAS_VER])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.categoriaService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaType })
  @ApiDescription('Actualizar una categoría por ID', [PermisoEnum.CATEGORIAS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'catalogos',
    tabla: 'Categoria',
    descripcion: 'Actualizar categoría',
  })
  update(
    @Param() params: CommonParamsDto.Id,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
    @AuthUser() session: IToken,
  ) {
    return this.categoriaService.update(params.id, updateCategoriaDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.CATEGORIAS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseCategoriaType })
  @ApiDescription('Eliminar una categoría por ID', [PermisoEnum.CATEGORIAS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'catalogos',
    tabla: 'Categoria',
    descripcion: 'Eliminar categoría',
  })
  remove(@Param() params: CommonParamsDto.Id) {
    return this.categoriaService.remove(params.id);
  }
}
```

---
@ApiTags('[admin] Productos')
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_CREAR])
  @ApiDescription('Crear un nuevo producto', [PermisoEnum.PRODUCTOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseProductoType })
  create(@Body() inputDto: CreateProductoDto) {
    return this.productoService.create(inputDto);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_VER])
  @ApiDescription('Listar todos los productos', [PermisoEnum.PRODUCTOS_VER])
  @ApiResponse({ status: 200, type: ResponseProductosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.productoService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_VER])
  @ApiDescription('Servicio post con filtros y paginado de productos', [
    PermisoEnum.PRODUCTOS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateProductosType })
  list(@Body() inputDto: ListProductoArgsDto) {
    return this.productoService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseProductoType })
  @ApiDescription('Obtener un producto por ID', [PermisoEnum.PRODUCTOS_VER])
  findOne(@Param() params: CommonParamsDto.Id) {
    return this.productoService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseProductoType })
  @ApiDescription('Actualizar un producto por ID', [PermisoEnum.PRODUCTOS_EDITAR])
  update(@Param() params: CommonParamsDto.Id, @Body() updateDto: UpdateProductoDto) {
    return this.productoService.update(params.id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseProductoType })
  @ApiDescription('Eliminar un producto por ID', [PermisoEnum.PRODUCTOS_ELIMINAR])
  remove(@Param() params: CommonParamsDto.Id) {
    return this.productoService.remove(params.id);
  }
}
```

---

## ✅Permisos
- [ ] Agregar permisos al enum `PermisoEnum` en `src/enums/permisos.enum.ts`:
  ```typescript
  // [Nombre del Módulo]
  [NOMBRE]_VER = '[NOMBRE]_VER',
  [NOMBRE]_CREAR = '[NOMBRE]_CREAR',
  [NOMBRE]_EDITAR = '[NOMBRE]_EDITAR',
  [NOMBRE]_ELIMINAR = '[NOMBRE]_ELIMINAR',
  ```
- [ ] Registrar permisos en la base de datos mediante seed o panel admin
- [ ] Asignar permisos a roles según sea necesario

###  Checklist de Creación de Módulo

Al crear un nuevo módulo CRUD, asegúrate de:

### Input DTOs (`[nombre].input.dto.ts`)
- [ ] `Create[Nombre]Dto` con todos los campos requeridos y opcionales
- [ ] Campos opcionales en Prisma (`field?`) → `@IsOptional()` en DTO
- [ ] Campos con valor por defecto → `@IsOptional()` en DTO (el default se aplica en DB)
- [ ] Campos tipo `Decimal` → `@IsNumber()` en DTO
- [ ] Campos tipo `DateTime` → `@IsDateString()` o `@IsISO8601()` si se envían como string
- [ ] `Update[Nombre]Dto` usando `PartialType`
- [ ] Todos los decoradores de validación (`@IsString`, `@IsOptional`, etc.)
- [ ] Todos los decoradores de Swagger (`@ApiProperty`, `@ApiPropertyOptional`)
- [ ] Decorador `@Expose()` en todos los campos

### Where DTOs (`[nombre].where.input.ts`)
- [ ] `[Nombre]WhereInput` con filtros apropiados
  - [ ] `StringFilter` / `StringNullableFilter` para strings
  - [ ] `IntFilter` / `FloatFilter` / `DecimalFilter` para números
  - [ ] `BoolFilter` para booleanos
  - [ ] `DateTimeFilter` / `DateTimeNullableFilter` para fechas
  - [ ] Campos de relación como `string` simple para filtrar por ID
- [ ] `[Nombre]SelectInput` con todos los campos del modelo
- [ ] `List[Nombre]ArgsDto` extendiendo `BaseFilterDto`
- [ ] Todos los decoradores (`@Expose()`, `@IsOptional()`, `@Type()`, `@ValidateNested()`)
- [ ] Todos los decoradores de Swagger (`@ApiPropertyOptional`)

### Response Types (`[nombre].response.ts`)
- [ ] `Response[Nombrselect` con `Response[Nombre]sType` (opcional, para dropdowns)
  - Sin permisos específicos (`@BearerAuthPermision()`)
  - Debe ir **antes** del `GET /:id`
- [ ] Endpoint `GET /` con `Response[Nombre]sType`
- [ ] Endpoint `POST /list` con `Paginate[Nombre]sType`
- [ ] Endpoint `GET /:id` con `Response[Nombre]DetailType`
- [ ] Endpoint `PATCH /:id` con `Response[Nombre]Type` y `@Audit`
- [ ] Endpoint `DELETE /:id` con `Response[Nombre]Type` y `@Audit`
- [ ] Todos los endpoints con `@BearerAuthPermision`
- [ ] Todos los endpoints con `@ApiDescription`
- [ ] Todos los endpoints con `@ApiResponse`
- [ ] Endpoints de creación/actualización con `@AuthUser() session: IToken`
- [ ] Decorador `@Audit` en CREATE, UPDATE y DELETE con:
  - `accion`: Tipo de acción (TipoAccionEnum)
  - `modulo`: Nombre del módulo
  - `tabla`: Nombre de la tabla/modelo
  - `descripcion`: Descripción de la acción

### Service (`[nombre].service.ts`)
- [ ] Método `create()` con validaciones de unicidad
- [ ] Método `findAll()` con paginación
- [ ] Método `filter()` con filtros avanzados
- [ ] Método `findOne()` con manejo de no encontrado
- [ ] Método `update()` con validaciones
- [ ] Método `remove()` con verificación de dependencias
- [ ] Método `getForSelect()` (opcional) que retorna:
  - Solo campos necesarios (`id`, `nombre`, etc.)
  - Solo registros activos
  - Ordenados alfabéticamente
- [ ] Usar `dataErrorValidations()` para errores de validación de campos específicos
- [ ] Usar `dataResponseError()` para errores generales (no encontrado, permisos, etc.)
- [ ] Importar funciones: `import { dataErrorValidations, dataResponseError, dataResponseSuccess } from 'src/common/dtos';`
- [ ] **Usar `dayjs` en vez de `new Date()` para conversiones de fechas**: `import dayjs from 'dayjs';`
- [ ] Usar `dataErrorValidations()` para errores de validación de campos
- [ ] Usar `dataResponseError()` para errores generales (no encontrado, etc.)ombre]sType`
- [ ] Endpoint `GET /:id` con `Response[Nombre]DetailType`
- [ ] Endpoint `PATCH /:id` con `Response[Nombre]Type` y `@Audit`
- [ ] Endpoint `DELETE /:id` con `Response[Nombre]Type` y `@Audit`
- [ ] Todos los endpoints con `@BearerAuthPermision`
- [ ] Todos los endpoints con `@ApiDescription`
- [ ] Todos los endpoints con `@ApiResponse`
- [ ] Endpoints de creación/actualización con `@AuthUser() session: IToken`
- [ � Gestión de Permisos para Nuevos Módulos

### 1. Agregar Permisos al Enum

Ubicación: `src/enums/permisos.enum.ts`

```typescript
export enum PermisoEnum {
  // ... permisos existentes

  // [Nombre del Módulo]
  [NOMBRE]_VER = '[NOMBRE]_VER',
  [NOMBRE]_CREAR = '[NOMBRE]_CREAR',
  [NOMBRE]_EDITAR = '[NOMBRE]_EDITAR',
  [NOMBRE]_ELIMINAR = '[NOMBRE]_ELIMINAR',
}
```

**Ejemplo para Sucursales:**
```typescript
// Sucursales
SUCURSALES_VER = 'SUCURSALES_VER',
SUCURSALES_CREAR = 'SUCURSALES_CREAR',
SUCURSALES_EDITAR = 'SUCURSALES_EDITAR',
SUCURSALES_ELIMINAR = 'SUCURSALES_ELIMINAR',
```

### 2. Registrar Permisos en la Base de Datos

#### Opción A: Mediante Seed (Recomendado)

Ubicación: `prisma/seed/auth.seed.ts` o crear un nuevo archivo de seed

```typescript
// Crear permisos
const permisosSucursales = [
  {
    nombre: 'SUCURSALES_VER',
    descripcion: 'Ver sucursales',
    modulo: 'catalogos',
    accion: 'ver',
    estaActivo: true,
  },
  {
    nombre: 'SUCURSALES_CREAR',
    descripcion: 'Crear sucursales',
    modulo: 'catalogos',
    accion: 'crear',
    estaActivo: true,
  },
  {
    nombre: 'SUCURSALES_EDITAR',
    descripcion: 'Editar sucursales',
    modulo: 'catalogos',
    accion: 'editar',
    estaActivo: true,
  },
  {
    nombre: 'SUCURSALES_ELIMINAR',
    descripcion: 'Eliminar sucursales',
    modulo: 'catalogos',
    accion: 'eliminar',
    estaActivo: true,
  },
];

// Insertar permisos
for (const permiso of permisosSucursales) {
  await prisma.permiso.upsert({
    where: { nombre: permiso.nombre },
    update: {},
    create: permiso,
  });
}
```

Ejecutar seed: `yarn prisma:seed`

#### Opción B: Mediante Panel de Administración

1. Acceder al módulo de permisos en el panel admin
2. Crear cada permiso manualmente con:
   - **Nombre**: `[NOMBRE]_[ACCION]` (ej: `SUCURSALES_VER`)
   - **Descripción**: Texto descriptivo
   - **Módulo**: Categoría del módulo (ej: `catalogos`, `finanzas`, `security`)
   - **Acción**: `ver`, `crear`, `editar`, `eliminar`
   - **Estado**: Activo

### 3. Asignar Permisos a Roles

Una vez creados los permisos, asígnalos a los roles correspondientes:

```typescript
// En seed o manualmente
const adminRole = await prisma.rol.findUnique({ where: { nombre: 'Administrador' } });

const permisosSucursales = await prisma.permiso.findMany({
  where: {
    nombre: {
      in: ['SUCURSALES_VER', 'SUCURSALES_CREAR', 'SUCURSALES_EDITAR', 'SUCURSALES_ELIMINAR'],
    },
  },
});

for (const permiso of permisosSucursales) {
  await prisma.rolPermiso.create({
    data: {
      rolId: adminRole.id,
      permisoId: permiso.id,
    },
  });
}
```

### 4. Usar Permisos en el Controlador

```typescript
@Get()
@BearerAuthPermision([PermisoEnum.SUCURSALES_VER])
@ApiDescription('Listar todas las sucursales', [PermisoEnum.SUCURSALES_VER])
findAll() {
  return this.service.findAll();
}
```

**Nota sobre `@BearerAuthPermision()`:**
- **Sin parámetros**: `@BearerAuthPermision()` - Solo requiere autenticación, sin permisos específicos
- **Con permisos**: `@BearerAuthPermision([PermisoEnum.X])` - Requiere autenticación y el permiso especificado

---

## 📦 Endpoint Select para Dropdowns

El endpoint `/select` es un patrón común para proporcionar datos optimizados para componentes select/dropdown en el frontend.

### Características del Endpoint Select

1. **Ruta**: `GET /[modulo]/select`
2. **Autenticación**: Requiere `@BearerAuthPermision()` sin permisos específicos
3. **Posición**: Debe declararse **ANTES** del endpoint `GET /:id`
4. **Respuesta**: Lista simple sin paginación
5. **Filtrado**: Solo registros activos
6. **Campos**: Solo los necesarios (id, nombre, abreviacion, etc.)
7. **Ordenamiento**: Alfabético por nombre

### Implementación Completa

#### En el Controller

```typescript
@Get('select')
@BearerAuthPermision()
@ApiDescription('Obtener [nombre]s para select/dropdown')
@ApiResponse({ status: 200, type: Response[Nombre]sType })
getForSelect() {
  return this.[nombre]Service.getForSelect();
}
```

#### En el Service

```typescript
async getForSelect() {
  const list = await this.prismaService.[nombre].findMany({
    where: { estaActiva: true }, // o estaActivo según el modelo
    select: {
      id: true,
      nombre: true,
      abreviacion: true, // opcional, según necesidad
    },
    orderBy: { nombre: 'asc' },
  });

  return dataResponseSuccess({ data: list });
}
```

#### Ejemplo con Sucursales

**Controller:**
```typescript
@Get('select')
@BearerAuthPermision()
@ApiDescription('Obtener sucursales para select/dropdown')
@ApiResponse({ status: 200, type: ResponseSucursalesType })
getForSelect() {
  return this.sucursalService.getForSelect();
}
```

**Service:**
```typescript
async getForSelect() {
  const list = await this.prismaService.sucursal.findMany({
    where: { estaActiva: true },
    select: {
      id: true,
      nombre: true,
      abreviacion: true,
    },
    orderBy: { nombre: 'asc' },
  });

  return dataResponseSuccess({ data: list });
}
```

### Respuesta Esperada

```json
{
  "error": false,
  "message": "Operación exitosa",
  "response": {
    "data": [
      {
        "id": 1,
        "nombre": "Sucursal Central",
        "abreviacion": "SC"
      },
      {
        "id": 2,
        "nombre": "Sucursal Norte",
        "abreviacion": "SN"
      }
    ]
  },
  "status": 200
}
```

### Cuándo Implementar el Endpoint Select

✅ **Implementar cuando:**
- El módulo será usado en dropdowns/selects del frontend
- Se necesita una lista simplificada de opciones
- El frontend necesita obtener datos sin paginación
- Los datos se usan frecuentemente en formularios

❌ **No implementar cuando:**
- El módulo nunca se usará en selects
- No hay necesidad de filtrar solo activos
- El listado general ya es suficiente

### Ventajas del Endpoint Select

1. **Performance**: Retorna solo campos necesarios
2. **Simplicidad**: No requiere paginación ni filtros complejos
3. **Seguridad**: Disponible para todos los usuarios autenticados
4. **Cache**: Ideal para cachear en el frontend por su simplicidad
5. **UX**: Mejora la experiencia al cargar selects más rápido

---

## ⚠️ Manejo de Errores y Validaciones en Services

El backend proporciona dos funciones principales para manejar errores, cada una con un propósito específico:

### 1. `dataErrorValidations()` - Errores de Validación de Campos

**Cuándo usar:** Para errores de validación de reglas de negocio relacionados con campos específicos del formulario.

**Características:**
- Retorna un objeto con errores por campo
- El frontend puede asociar cada error al campo correspondiente
- Ideal para validaciones de unicidad, formato, dependencias entre campos
- HTTP Status: 400 (Bad Request)

**Estructura de respuesta:**
```typescript
{
  "error": true,
  "message": "Validation error",
  "response": {
    "validationErrors": {
      "nombreCampo": ["Mensaje de error 1", "Mensaje de error 2"],
      "otroCampo": ["Mensaje de error"]
    }
  },
  "status": 400
}
```

**Uso en el servicio:**
```typescript
// Validar unicidad de nombre
const existeNombre = await this.prismaService.sucursal.findUnique({
  where: { nombre: inputDto.nombre },
});
if (existeNombre)
  return dataErrorValidations({ nombre: ['El nombre de la sucursal ya existe'] });

// Múltiples errores de validación
if (errorCondition1 && errorCondition2)
  return dataErrorValidations({
    campo1: ['Error en campo 1'],
    campo2: ['Error en campo 2', 'Otro error en campo 2'],
  });
```

**Ejemplo completo en `create()`:**
```typescript
async create(inputDto: CreateSucursalDto, session: IToken) {
  // Validar que el nombre sea único
  const existeNombre = await this.prismaService.sucursal.findUnique({
    where: { nombre: inputDto.nombre },
    select: { id: true },
  });
  if (existeNombre)
    return dataErrorValidations({ nombre: ['El nombre de la sucursal ya existe'] });

  // Validar que la abreviación sea única
  const existeAbreviacion = await this.prismaService.sucursal.findUnique({
    where: { abreviacion: inputDto.abreviacion },
    select: { id: true },
  });
  if (existeAbreviacion)
    return dataErrorValidations({ abreviacion: ['La abreviación de la sucursal ya existe'] });

  const result = await this.prismaService.sucursal.create({
    data: {
      ...inputDto,
      userCreateId: session.usuarioId,
    },
  });

  return dataResponseSuccess<Sucursal>({ data: result });
}
```

**Ejemplo en `update()`:**
```typescript
async update(id: number, updateDto: UpdateSucursalDto, session: IToken) {
  const exists = await this.prismaService.sucursal.findUnique({
    where: { id },
  });
  if (!exists) return dataResponseError('Sucursal no encontrada');

  // Validar nombre único si se actualiza
  if (updateDto.nombre) {
    const existeNombre = await this.prismaService.sucursal.findFirst({
      where: {
        nombre: updateDto.nombre,
        NOT: { id },
      },
    });
    if (existeNombre)
      return dataErrorValidations({ nombre: ['El nombre de la sucursal ya existe'] });
  }

  // Validar abreviación única si se actualiza
  if (updateDto.abreviacion) {
    const existeAbreviacion = await this.prismaService.sucursal.findFirst({
      where: {
        abreviacion: updateDto.abreviacion,
        NOT: { id },
      },
    });
    if (existeAbreviacion)
      return dataErrorValidations({ abreviacion: ['La abreviación de la sucursal ya existe'] });
  }

  const result = await this.prismaService.sucursal.update({
    where: { id },
    data: {
      ...updateDto,
      userUpdateId: session.usuarioId,
    },
  });

  return dataResponseSuccess<Sucursal>({ data: result });
}
```

### 2. `dataResponseError()` - Errores Generales

**Cuándo usar:** Para errores generales que no están relacionados con campos específicos del formulario.

**Características:**
- Retorna un mensaje de error general
- No está asociado a ningún campo específico
- Ideal para: recurso no encontrado, permisos insuficientes, errores de negocio generales
- HTTP Status: Variable (404, 403, 500, etc.)

**Estructura de respuesta:**
```typescript
{
  "error": true,
  "message": "Mensaje de error general",
  "response": {},
  "status": 404 // o el código apropiado
}
```

**Uso en el servicio:**
```typescript
// Recurso no encontrado
const item = await this.prismaService.sucursal.findUnique({ where: { id } });
if (!item) return dataResponseError('Sucursal no encontrada');

// Error de negocio general
if (!puedaEliminar)
  return dataResponseError('No se puede eliminar la sucursal porque tiene registros asociados');

// Permisos insuficientes
if (!tienePermiso)
  return dataResponseError('No tiene permisos para realizar esta acción');
```

### 3. `dataResponseSuccess()` - Respuestas Exitosas

**Uso:** Para todas las respuestas exitosas.

**Estructura:**
```typescript
return dataResponseSuccess<Sucursal>({
  data: result,
  pagination: { page: 1, limit: 10, total: 100 }, // opcional
});
```

### Tabla de Decisión: ¿Cuál usar?

| Escenario | Función | Ejemplo |
|-----------|---------|----------|
| Campo duplicado | `dataErrorValidations()` | `{ nombre: ['El nombre ya existe'] }` |
| Formato inválido | `dataErrorValidations()` | `{ email: ['Email inválido'] }` |
| Dependencia entre campos | `dataErrorValidations()` | `{ fechaFin: ['Debe ser mayor a fecha inicio'] }` |
| Recurso no encontrado | `dataResponseError()` | `'Sucursal no encontrada'` |
| No se puede eliminar | `dataResponseError()` | `'No se puede eliminar por dependencias'` |
| Permisos insuficientes | `dataResponseError()` | `'Sin permisos para esta acción'` |
| Operación exitosa | `dataResponseSuccess()` | `{ data: result }` |

### Buenas Prácticas

1. **Validaciones de unicidad**: Siempre usa `dataErrorValidations()` con el nombre del campo
   ```typescript
   if (existeDuplicado)
     return dataErrorValidations({ campo: ['Ya existe un registro con este valor'] });
   ```

2. **Múltiples validaciones**: Agrupa todas las validaciones de campos antes de ejecutar la operación
   ```typescript
   const errores: Record<string, string[]> = {};
   if (existeNombre) errores.nombre = ['El nombre ya existe'];
   if (existeEmail) errores.email = ['El email ya existe'];
   if (Object.keys(errores).length > 0) return dataErrorValidations(errores);
   ```

3. **Orden de validaciones**:
   - Primero: Validar que el recurso existe (usar `dataResponseError` si no existe)
   - Segundo: Validar campos específicos (usar `dataErrorValidations`)
   - Tercero: Ejecutar la operación
   - Cuarto: Retornar éxito con `dataResponseSuccess`

4. **Mensajes descriptivos**: Usa mensajes claros que el usuario pueda entender y actuar sobre ellos

5. **Importación**: Ambas funciones se importan desde el mismo lugar
   ```typescript
   import { dataErrorValidations, dataResponseError, dataResponseSuccess } from 'src/common/dtos';
   ```

6. **Conversión de fechas**: Usa `dayjs` en vez de `new Date()` para convertir fechas
   ```typescript
   import dayjs from 'dayjs';

   ademas usar fechas en formato iso
   ```

---

## �] Decorador `@Audit` en CREATE, UPDATE y DELETE con:
  - `accion`: Tipo de acción (TipoAccionEnum)
  - `modulo`: Nombre del módulo
  - `tabla`: Nombre de la tabla/modelo
  - `descripcion`: Descripción de la acción

### Permisos
- [ ] Agregar permisos al enum `PermisoEnum`:
  - `[NOMBRE]_VER`
  - `[NOMBRE]_CREAR`
  - `[NOMBRE]_EDITAR`
  - `[NOMBRE]_ELIMINAR`

---

## 🔗 Referencias

- **DTOs Base**: `src/common/dtos/`
  - `response.dto.ts` → `ApiOkResponseDto`, `ResponseStructDTO`
  - `filters.dto.ts` → `BaseFilterDto`, `ListFindAllQueryDto`
  - `prisma/` → Filtros de Prisma (`StringFilter`, `IntFilter`, etc.)

- **Decoradores**:
  - `src/common/decorators/controller.decorator.ts` → `@ApiDescription`
  - `src/common/decorators/authorization.decorator.ts` → `@BearerAuthPermision`
  - `src/common/decorators/token.decorator.ts` → `@AuthUser`, `IToken`
  - `src/common/decorators/audit.decorator.ts` → `@Audit`
  - `src/common/interceptors/audit.interceptor.ts` → `AuditInterceptor`

- **Enums**:
  - `src/enums/permisos.enum.ts` → `PermisoEnum`
  - `src/generated/prisma/enums` → `TipoAccionEnum`

---

## 🎓 Tips y Mejores Prácticas

1. **Nomenclatura Consistente**: Siempre usa singular para el nombre del módulo y plural para las rutas del controlador.

2. **Tipos de Respuesta**: Cada método del controlador debe tener su tipo de respuesta específico en `@ApiResponse`.

3. **Filtros Prisma**: Usa los filtros apropiados según el tipo de campo:
   - String → `StringFilter` o `StringNullableFilter`
   - Number → `IntFilter` o `FloatFilter`
   - Boolean → `BoolFilter`
   - Date → `DateTimeFilter`

4. **PartialType**: Usa `PartialType` para Update DTOs en lugar de duplicar campos.

5. **OmitType**: 
   - Para respuestas individuales: omite `pagination`
   - Para respuestas paginadas: omite `validationErrors`
   - Para todos los response types: omite `cache`

6. **Permisos**: Define permisos granulares por acción (VER, CREAR, EDITAR, ELIMINAR).

7. **Swagger**: Documenta TODO con decoradores de Swagger para una API autodocumentada.

8. **Validación**: Usa class-validator para validar todos los inputs del cliente.

9. **Orden de Decoradores**: 
   - Siempre comienza con `@Expose()`
   - Luego validaciones (`@IsDefined()`, `@IsOptional()`)
   - Después validaciones de tipo (`@IsString()`, etc.)
   - Finalmente Swagger (`@ApiProperty()`)

10. **Auditoría**: 
    - Usa `@UseInterceptors(AuditInterceptor)` a nivel de controlador
    - Aplica `@Audit({...})` en endpoints que modifican datos (CREATE, UPDATE, DELETE)
    - Inyecta `@AuthUser() session: IToken` en métodos que requieren rastreo de usuario

11. **Sesión de Usuario**:
    - Usa `@AuthUser() session: IToken` en lugar de `@Request() req`
    - Pasa `session` al servicio para rastrear `userCreateId` y `userUpdateId`
    - La sesión incluye: `usuarioId`, `nombreCompleto`, `estaActivo`, `token`, `expireIn`, `client`

12. **Manejo de Fechas (DateTime)**:
    - En Prisma: `@db.Timestamptz()` para fechas con zona horaria
    - En DTOs: Usa `@IsDateString()` o `@IsISO8601()` para validación
    - Para fechas opcionales en filtros: `DateTimeNullableFilter`
    - Ejemplo de campo fecha: `fechaDerivacion DateTime @default(now()) @db.Timestamptz()`

13. **Campos Opcionales con Valor por Defecto**:
    - En schema: `prioridad String @default("normal") @db.VarChar(20)`
    - En CreateDTO: Marca como `@IsOptional()` para que el usuario pueda omitirlo
    - El valor por defecto se aplica automáticamente en la base de datos

---