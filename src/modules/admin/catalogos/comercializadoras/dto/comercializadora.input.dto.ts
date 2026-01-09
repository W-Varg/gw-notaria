import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { IntFilter } from 'src/common/dtos/prisma/int-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { DateTimeFilter, DateTimeNullableFilter } from 'src/common/dtos';

class ComercializadoraMetaData {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Proyecto urbano' })
  proyectoUrb?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Manzana' })
  mza?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Proyecto' })
  proy?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'Lote' })
  lote?: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({ type: Date, description: 'Fecha de recepción' })
  fechaRecepcion?: Date | string;
}

export class CreateComercializadoraDto {
  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    description: 'Nombre de la comercializadora',
    example: 'Comercializadora Los Pinos',
    minLength: 3,
    maxLength: 150,
  })
  nombre: string;

  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'Tipo de comercializadora: 1=techo, 2=monumental',
    example: 1,
    enum: [1, 2],
  })
  tipoComercializadora: number;

  @Expose()
  @IsDefined()
  @ValidateNested()
  @ApiProperty({
    description: 'Metadatos adicionales (proyecto urb, mza, proy, lote, fecha recepción)',
    example: { proyectoUrb: 'Los Pinos', mza: 'A', proy: 'Etapa 1', lote: '10' },
    type: ComercializadoraMetaData,
  })
  metaData: ComercializadoraMetaData;

  @Expose()
  @IsDefined()
  @IsInt()
  @ApiProperty({
    description: 'ID de la sucursal',
    example: 1,
  })
  sucursalId: number;

  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del cliente asociado',
    example: 'clkxxx123456789',
  })
  clienteId: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Minuta',
    example: 'Minuta 123/2026',
    maxLength: 255,
  })
  minuta?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Protocolo',
    example: 'Protocolo 456/2026',
    maxLength: 255,
  })
  protocolo?: string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Fecha de envío físico del documento',
    example: '2026-01-09T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  fechaEnvio?: Date | string;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Fecha de envío del testimonio',
    example: '2026-01-09T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  fechaEnvioTestimonio?: Date | string;
}

export class UpdateComercializadoraDto extends PartialType(CreateComercializadoraDto) {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Indica si está consolidado',
    example: false,
  })
  consolidado?: boolean;
}
