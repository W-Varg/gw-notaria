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
│   ├── [nombre].input.dto.ts      # DTOs de entrada (Create, Update, Filter)
│   └── [nombre].response.ts       # DTOs de respuesta (tipos de retorno)
├── [nombre].controller.ts         # Controlador con endpoints
├── [nombre].service.ts            # Lógica de negocio
├── [nombre].entity.ts             # Entidades para Swagger
├── [nombre].module.ts             # Módulo NestJS
└── README.md                      # Documentación del módulo
```

---

## 📥 DTOs de Entrada (Input)

### Archivo: `[nombre].input.dto.ts`

Este archivo contiene todos los DTOs para las operaciones de entrada del módulo.

### 1️⃣ CreateDto - DTO de Creación

```typescript
export class Create[Nombre]Dto {
  // Campos requeridos
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ type: String })
  nombre: string;

  // Campos opcionales
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActiva?: boolean;
}
```

**Decoradores importantes:**
- `@Expose()`: Permite la serialización del campo
- `@IsDefined()`: Campo obligatorio
- `@IsOptional()`: Campo opcional
- `@IsString()`, `@IsBoolean()`, `@IsNumber()`: Validación de tipo
- `@MinLength()`, `@MaxLength()`: Validación de longitud
- `@ApiProperty()`: Documentación Swagger (requerido)
- `@ApiPropertyOptional()`: Documentación Swagger (opcional)

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

  // Filtros para fechas
  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCreacion?: DateTimeFilter;
}
```

**Tipos de filtros disponibles:**
- `StringFilter`: Para campos `string`
- `StringNullableFilter`: Para campos `string | null`
- `IntFilter`: Para campos `number` (enteros)
- `FloatFilter`: Para campos `number` (decimales)
- `BoolFilter`: Para campos `boolean`
- `DateTimeFilter`: Para campos `Date`

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
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermisoEnum } from 'src/enums/permisos.enum';

@ApiTags('[admin] [Nombre]s')
@Controller('[nombre]s')
export class [Nombre]Controller {
  constructor(private readonly [nombre]Service: [Nombre]Service) {}

  // Endpoints aquí...
}
```

### 1️⃣ Endpoint CREATE - `POST /`

```typescript
@Post()
@BearerAuthPermision([PermisoEnum.[NOMBRE]_CREAR])
@ApiDescription('Crear un nuevo [nombre]', [PermisoEnum.[NOMBRE]_CREAR])
@ApiResponse({ status: 200, type: () => Response[Nombre]Type })
create(@Body() inputDto: Create[Nombre]Dto) {
  return this.[nombre]Service.create(inputDto);
}
```

**Retorna:** `Response[Nombre]Type` (registro individual)

### 2️⃣ Endpoint READ ALL - `GET /`

```typescript
@Get()
@BearerAuthPermision([PermisoEnum.[NOMBRE]_VER])
@ApiDescription('Listar todos los [nombre]s', [PermisoEnum.[NOMBRE]_VER])
@ApiResponse({ type: Response[Nombre]sType })
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

### 4️⃣ Endpoint READ ONE - `GET /:id`

```typescript
@Get(':id')
@BearerAuthPermision([PermisoEnum.[NOMBRE]_VER])
@ApiResponse({ status: 200, type: () => Response[Nombre]DetailType })
@ApiDescription('Obtener un [nombre] por ID', [PermisoEnum.[NOMBRE]_VER])
findOne(@Param('id') id: string) {
  return this.[nombre]Service.findOne(id);
}
```

**Retorna:** `Response[Nombre]DetailType` (con relaciones)

### 5️⃣ Endpoint UPDATE - `PATCH /:id`

```typescript
@Patch(':id')
@BearerAuthPermision([PermisoEnum.[NOMBRE]_EDITAR])
@ApiResponse({ status: 200, type: () => Response[Nombre]Type })
@ApiDescription('Actualizar un [nombre] por ID', [PermisoEnum.[NOMBRE]_EDITAR])
update(@Param('id') id: string, @Body() updateDto: Update[Nombre]Dto) {
  return this.[nombre]Service.update(id, updateDto);
}
```

**Retorna:** `Response[Nombre]Type` (registro actualizado)

### 6️⃣ Endpoint DELETE - `DELETE /:id`

```typescript
@Delete(':id')
@BearerAuthPermision([PermisoEnum.[NOMBRE]_ELIMINAR])
@ApiResponse({ status: 200, type: () => Response[Nombre]Type })
@ApiDescription('Eliminar un [nombre] por ID', [PermisoEnum.[NOMBRE]_ELIMINAR])
remove(@Param('id') id: string) {
  return this.[nombre]Service.remove(id);
}
```

**Retorna:** `Response[Nombre]Type` (registro eliminado)

### Tabla de Mapeo: Endpoint → Response Type

| Método HTTP | Ruta | Operación | Response Type | Service Method |
|-------------|------|-----------|---------------|----------------|
| `POST` | `/` | Crear | `Response[Nombre]Type` | `create()` |
| `GET` | `/` | Listar todo | `Response[Nombre]sType` | `findAll()` |
| `POST` | `/list` | Listar filtrado | `Paginate[Nombre]sType` | `filter()` |
| `GET` | `/:id` | Obtener uno | `Response[Nombre]DetailType` | `findOne()` |
| `PATCH` | `/:id` | Actualizar | `Response[Nombre]Type` | `update()` |
| `DELETE` | `/:id` | Eliminar | `Response[Nombre]Type` | `remove()` |

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
| Response DTOs | `[nombre].response.ts` | `categoria.response.ts` |

**Nota:** 
- Los **nombres de clase** usan **PascalCase**: `CreateCategoriaDto`
- Los **nombres de archivo** usan **kebab-case**: `categoria.input.dto.ts`
- Los **nombres de ruta** usan **plural**: `/categorias`

---

## 🎯 Ejemplos Completos

### Ejemplo 1: Módulo de Productos

```typescript
// producto.input.dto.ts
export class CreateProductoDto {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String })
  nombre: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  precio?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  categoriaId?: string;
}

export class UpdateProductoDto extends PartialType(CreateProductoDto) {}

class ProductoWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  precio?: FloatFilter;
}

export class ListProductoArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ProductoWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductoWhereInput)
  where?: ProductoWhereInput;
}
```

```typescript
// producto.response.ts
class ProductoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Producto })
  data: Producto;
}

export class ResponseProductoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ProductoData })
  declare response: ProductoData;
}

class ProductosData {
  @ApiProperty({ type: [Producto] })
  data?: Producto[];
}

export class ResponseProductosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ProductosData })
  declare response: ProductosData;
}

class PaginateProductosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Producto] })
  data?: Producto[];
}

export class PaginateProductosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateProductosData })
  declare response: PaginateProductosData;
}
```

```typescript
// producto.controller.ts
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
  @ApiResponse({ type: ResponseProductosType })
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
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseProductoType })
  @ApiDescription('Actualizar un producto por ID', [PermisoEnum.PRODUCTOS_EDITAR])
  update(@Param('id') id: string, @Body() updateDto: UpdateProductoDto) {
    return this.productoService.update(id, updateDto);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.PRODUCTOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseProductoType })
  @ApiDescription('Eliminar un producto por ID', [PermisoEnum.PRODUCTOS_ELIMINAR])
  remove(@Param('id') id: string) {
    return this.productoService.remove(id);
  }
}
```

---

## ✅ Checklist de Creación de Módulo

Al crear un nuevo módulo CRUD, asegúrate de:

### Input DTOs (`[nombre].input.dto.ts`)
- [ ] `Create[Nombre]Dto` con todos los campos requeridos y opcionales
- [ ] `Update[Nombre]Dto` usando `PartialType`
- [ ] `[Nombre]WhereInput` con filtros apropiados
- [ ] `[Nombre]SelectInput` con todos los campos del modelo
- [ ] `List[Nombre]ArgsDto` extendiendo `BaseFilterDto`
- [ ] Todos los decoradores de validación (`@IsString`, `@IsOptional`, etc.)
- [ ] Todos los decoradores de Swagger (`@ApiProperty`, `@ApiPropertyOptional`)
- [ ] Decorador `@Expose()` en todos los campos

### Response Types (`[nombre].response.ts`)
- [ ] `Response[Nombre]Type` para operaciones individuales
- [ ] `Response[Nombre]DetailType` para lecturas con relaciones (si aplica)
- [ ] `Response[Nombre]sType` para listas simples
- [ ] `Paginate[Nombre]sType` para listas paginadas
- [ ] Clases `Data` intermedias correctamente definidas
- [ ] Usar `OmitType` correctamente según el tipo de respuesta

### Controller (`[nombre].controller.ts`)
- [ ] Tag `@ApiTags('[admin] [Nombre]s')`
- [ ] Decorador `@Controller('[nombre]s')` con ruta en plural
- [ ] Endpoint `POST /` con `Response[Nombre]Type`
- [ ] Endpoint `GET /` con `Response[Nombre]sType`
- [ ] Endpoint `POST /list` con `Paginate[Nombre]sType`
- [ ] Endpoint `GET /:id` con `Response[Nombre]DetailType`
- [ ] Endpoint `PATCH /:id` con `Response[Nombre]Type`
- [ ] Endpoint `DELETE /:id` con `Response[Nombre]Type`
- [ ] Todos los endpoints con `@BearerAuthPermision`
- [ ] Todos los endpoints con `@ApiDescription`
- [ ] Todos los endpoints con `@ApiResponse`

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

- **Enums**:
  - `src/enums/permisos.enum.ts` → `PermisoEnum`

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

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.0.0
