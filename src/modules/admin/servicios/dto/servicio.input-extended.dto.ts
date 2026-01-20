import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from '../../../../common/dtos/filters.dto';
import { StringFilter } from '../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../common/dtos/prisma/string-nullable-filter.input';
import { DateTimeFilter, DateTimeNullableFilter } from '../../../../common/dtos';
import { IntFilter } from '../../../../common/dtos/prisma/int-filter.input';
import { FloatFilter } from '../../../../common/dtos/prisma/float-filter.input';
import { BoolFilter } from '../../../../common/dtos/prisma/bool-filter.input';

/**
 * DTO para crear un servicio
 * Usado en: POST /servicios
 */
export class CreateServicioDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({
    type: String,
    description: 'Código único del ticket/servicio',
    example: 'TKT-2026-001',
  })
  codigoTicket: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'ID del cliente',
  })
  clienteId: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'ID del tipo de documento',
  })
  tipoDocumentoId: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'ID del tipo de trámite',
  })
  tipoTramiteId: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    type: Number,
    description: 'ID del estado actual',
  })
  estadoActualId?: number;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-01-15T00:00:00Z',
  })
  fechaEstimadaEntrega?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    type: Number,
    example: 7,
  })
  plazoEntregaDias?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({
    type: String,
    enum: ['normal', 'alta', 'urgente'],
    default: 'normal',
  })
  prioridad?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  observaciones?: string;

  @Expose()
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiProperty({
    type: Number,
    example: 1500.0,
  })
  montoTotal: number;

  @Expose()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiPropertyOptional({
    type: Number,
    example: 750.0,
  })
  saldoPendiente?: number;
}

/**
 * DTO para actualizar un servicio
 * Usado en: PATCH /servicios/:id
 */
export class UpdateServicioDto extends PartialType(CreateServicioDto) {
  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
  })
  fechaFinalizacion?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  contenidoFinal?: string;
}

/**
 * Filtros WHERE para búsqueda de servicios
 */
class ServicioWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  codigoTicket?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  clienteId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipoDocumentoId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipoTramiteId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  estadoActualId?: IntFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaInicio?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeNullableFilter })
  @IsOptional()
  @Type(() => DateTimeNullableFilter)
  fechaFinalizacion?: DateTimeNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  prioridad?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  montoTotal?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  saldoPendiente?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActivo?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    description: 'Búsqueda de texto libre',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

/**
 * Include para relaciones
 */
class ServicioIncludeInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  cliente?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  tipoDocumento?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  tipoTramite?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  estadoActual?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  historialEstadosServicio?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  responsablesServicio?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  derivaciones?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  pagosIngresos?: boolean;
}

/**
 * Select de campos específicos
 */
class ServicioSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  codigoTicket?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  clienteId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  montoTotal?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  saldoPendiente?: boolean;
}

/**
 * DTO para listar servicios con filtros
 * Usado en: GET /servicios
 */
export class ListServiciosArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ServicioWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioWhereInput)
  where?: ServicioWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: ServicioIncludeInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioIncludeInput)
  include?: ServicioIncludeInput;

  @Expose()
  @ApiPropertyOptional({ type: ServicioSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ServicioSelectInput)
  select?: ServicioSelectInput;
}

/**
 * DTO para filtros del dashboard (versión simplificada)
 * Usado en: GET /servicios/dashboard
 */
export class ServiciosDashboardFilterDto {
  @Expose()
  @ApiPropertyOptional({
    type: String,
    enum: ['EN_PROCESO', 'ENVIADOS', 'PENDIENTE_PAGO', 'FINALIZADO', 'TODOS'],
  })
  @IsOptional()
  @IsString()
  estadoFiltro?: 'EN_PROCESO' | 'ENVIADOS' | 'PENDIENTE_PAGO' | 'FINALIZADO' | 'TODOS';
  @Expose()
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  search?: string;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    default: 6,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}

/**
 * DTO para estadísticas del dashboard
 * Usado en respuesta de: GET /servicios/stats
 */
export class ServiciosStatsDto {
  @Expose()
  @ApiProperty({ type: Number })
  enProceso: number;

  @Expose()
  @ApiProperty({ type: Number })
  enviados: number;

  @Expose()
  @ApiProperty({ type: Number })
  pendientePago: number;

  @Expose()
  @ApiProperty({ type: Number })
  finalizados: number;

  @Expose()
  @ApiProperty({ type: Number })
  total: number;

  @Expose()
  @ApiProperty({ type: Number })
  totalPendienteCobro: number;

  @Expose()
  @ApiProperty({ type: Number })
  totalIngresos: number;
}

/**
 * DTO para actualizar el estado/progreso
 * Usado en: PATCH /servicios/:id/progreso
 */
export class UpdateServicioProgresoDto {
  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({ type: Number })
  estadoActualId: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  comentario?: string;
}

/**
 * DTO para registrar un pago
 * Usado en: POST /servicios/:id/pagos
 */
export class RegistrarPagoServicioDto {
  @Expose()
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiProperty({
    type: Number,
    example: 500.0,
  })
  monto: number;

  @Expose()
  @IsDefined()
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({
    type: Number,
    description: '1=EFECTIVO, 2=QR, 3=TRANSFERENCIA, 4=CHEQUE, 5=DEPOSITO',
    enum: [1, 2, 3, 4, 5],
  })
  tipoPago: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  cuentaBancariaId?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({ type: String })
  numeroConstancia?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  concepto?: string;
}
