import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  IsObject,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
import { BaseFilterDto, OrderQueryDto, PaginationQueryDto } from 'src/common/dtos/filters.dto';

export class CreateReporteDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ type: String })
  @Expose()
  nombre: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ type: String })
  @Expose()
  descripcion?: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    enum: ['ventas', 'inventario', 'clientes', 'productos', 'pedidos', 'entregas'],
  })
  @Expose()
  tipo: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  @Expose()
  parametros?: Record<string, any>;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, enum: ['pdf', 'excel', 'csv'] })
  @Expose()
  formato?: string;
}

export class UpdateReporteDto extends PartialType(CreateReporteDto) {}

export class ListReporteArgsDto extends IntersectionType(
  BaseFilterDto,
  PaginationQueryDto,
  OrderQueryDto,
) {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Expose()
  nombre?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    enum: ['ventas', 'inventario', 'clientes', 'productos', 'pedidos', 'entregas'],
  })
  @Expose()
  tipo?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, enum: ['generando', 'completado', 'error'] })
  @Expose()
  estado?: string;
}

export class GenerarReporteDto {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    enum: ['ventas', 'inventario', 'clientes', 'productos', 'pedidos', 'entregas'],
  })
  @Expose()
  tipo: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  @Expose()
  parametros?: Record<string, any>;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, enum: ['pdf', 'excel', 'csv'] })
  @Expose()
  formato: string;
}

// DTOs específicos para cada reporte
export class ReporteVentasDto {
  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de inicio del período (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @Expose()
  fechaInicio?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de fin del período (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @Expose()
  fechaFin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'ID de la sucursal para filtrar',
    example: 'sucursal-uuid',
  })
  @Expose()
  sucursalId?: string;
}

export class ReporteInventarioDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'ID de la sucursal para filtrar inventario',
    example: 'sucursal-uuid',
  })
  @Expose()
  sucursalId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'ID de la categoría para filtrar productos',
    example: 'categoria-uuid',
  })
  @Expose()
  categoriaId?: string;
}

export class ReporteClientesDto {
  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de inicio para filtrar clientes activos',
    example: '2024-01-01',
  })
  @Expose()
  fechaInicio?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de fin para filtrar clientes activos',
    example: '2024-12-31',
  })
  @Expose()
  fechaFin?: string;
}

export class ReporteProductosDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'ID de la categoría para filtrar productos',
    example: 'categoria-uuid',
  })
  @Expose()
  categoriaId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'ID del tipo de producto para filtrar',
    example: 'tipo-uuid',
  })
  @Expose()
  tipoProductoId?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de inicio para análisis de ventas',
    example: '2024-01-01',
  })
  @Expose()
  fechaInicio?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de fin para análisis de ventas',
    example: '2024-12-31',
  })
  @Expose()
  fechaFin?: string;
}

export class ReportePedidosDto {
  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de inicio del período',
    example: '2024-01-01',
  })
  @Expose()
  fechaInicio?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de fin del período',
    example: '2024-12-31',
  })
  @Expose()
  fechaFin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'ID de la sucursal para filtrar pedidos',
    example: 'sucursal-uuid',
  })
  @Expose()
  sucursalId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Estado del pedido',
    enum: [
      'PENDIENTE',
      'CONFIRMADO',
      'EN_PREPARACION',
      'LISTO_PARA_ENTREGA',
      'ENTREGADO',
      'CANCELADO',
      'REEMBOLSADO',
    ],
  })
  @Expose()
  estado?: string;
}

export class ReporteEntregasDto {
  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de inicio del período',
    example: '2024-01-01',
  })
  @Expose()
  fechaInicio?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Fecha de fin del período',
    example: '2024-12-31',
  })
  @Expose()
  fechaFin?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'ID de la sucursal para filtrar entregas',
    example: 'sucursal-uuid',
  })
  @Expose()
  sucursalId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'Estado de la entrega',
    enum: ['PENDIENTE', 'PROGRAMADA', 'EN_CAMINO', 'ENTREGADA', 'CANCELADA'],
  })
  @Expose()
  estado?: string;
}
