import { IsString, IsInt, IsOptional, IsBoolean, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

export class CreateComercializadoraDto {
  @ApiProperty({ description: 'Nombre de la comercializadora', example: 'Comercializadora Los Pinos' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Tipo de comercializadora: 1=techo, 2=monumental', example: 1, enum: [1, 2] })
  @IsInt()
  tipo: number;

  @ApiProperty({ description: 'Metadatos adicionales (proyecto, mza, lote, etc.)', example: { proyectoUrb: 'Los Pinos', mza: 'A', lote: '10' } })
  @IsObject()
  metaData: Record<string, any>;

  @ApiProperty({ description: 'Departamento', example: 'La Paz' })
  @IsString()
  departamento: string;

  @ApiProperty({ description: 'ID del cliente asociado', example: 'ckxxx123456789' })
  @IsString()
  clienteId: string;

  @ApiPropertyOptional({ description: 'Indica si está consolidado', example: false })
  @IsOptional()
  @IsBoolean()
  consolidado?: boolean;

  @ApiPropertyOptional({ description: 'Minuta', example: 'Minuta 123/2026' })
  @IsOptional()
  @IsString()
  minuta?: string;

  @ApiPropertyOptional({ description: 'Protocolo', example: 'Protocolo 456/2026' })
  @IsOptional()
  @IsString()
  protocolo?: string;

  @ApiPropertyOptional({ description: 'Fecha de envío físico del documento', example: '2026-01-09T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fechaEnvio?: string;

  @ApiPropertyOptional({ description: 'Fecha de envío del testimonio', example: '2026-01-09T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fechaEnvioTestimonio?: string;
}

export class UpdateComercializadoraDto extends PartialType(CreateComercializadoraDto) {}

export class ComercializadoraWhereInput {
  @ApiPropertyOptional({ description: 'Filtro por nombre', example: 'Los Pinos' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Filtro por tipo: 1=techo, 2=monumental', example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tipo?: number;

  @ApiPropertyOptional({ description: 'Filtro por departamento', example: 'La Paz' })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiPropertyOptional({ description: 'Filtro por cliente ID', example: 'ckxxx123456789' })
  @IsOptional()
  @IsString()
  clienteId?: string;

  @ApiPropertyOptional({ description: 'Filtro por consolidado', example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  consolidado?: boolean;
}

export class ListComercializadoraArgsDto extends ListFindAllQueryDto {
  @ApiPropertyOptional({ description: 'Filtros para comercializadoras', type: ComercializadoraWhereInput })
  @IsOptional()
  @Type(() => ComercializadoraWhereInput)
  where?: ComercializadoraWhereInput;
}
