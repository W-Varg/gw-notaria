import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString, IsInt, Min } from 'class-validator';

export class PeriodoQueryDto {
  @Expose()
  @ApiPropertyOptional({ description: 'Fecha inicio (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  @Expose()
  fechaInicio?: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Fecha fin (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  @Expose()
  fechaFin?: string;

  @Expose()
  @ApiPropertyOptional({ description: 'ID de sucursal' })
  @IsOptional()
  @IsString()
  @Expose()
  sucursalId?: string;
}

export class TopProductosQueryDto extends PeriodoQueryDto {
  @Expose()
  @ApiPropertyOptional({ description: 'Límite de productos', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Expose()
  limite?: number = 10;
}

export class ClientesRecientesQueryDto {
  @Expose()
  @ApiPropertyOptional({ description: 'Límite de clientes', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Expose()
  limite?: number = 10;
}
