import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from '../../../../common/dtos/filters.dto';
import { StringFilter } from '../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../common/dtos/prisma/string-nullable-filter.input';
import { BoolFilter } from '../../../../common/dtos/prisma/bool-filter.input';
import { IntFilter } from '../../../../common/dtos/prisma/int-filter.input';

// ==================== CREATE DTO ====================
export class CreateFaqDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @ApiProperty({
    type: String,
    description: 'Pregunta frecuente',
    example: '¿Cuáles son los documentos necesarios para una escritura pública?',
  })
  pregunta: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(20)
  @ApiProperty({
    type: String,
    description: 'Respuesta detallada a la pregunta',
    example:
      'Para realizar una escritura pública necesita: documento de identidad vigente, títulos de propiedad...',
  })
  respuesta: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({
    type: String,
    description: 'Categoría de la pregunta',
    example: 'Trámites Notariales',
  })
  categoria?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({
    type: Number,
    default: 0,
    description: 'Orden de visualización',
  })
  orden?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    type: Boolean,
    default: true,
    description: 'Estado activo/inactivo',
  })
  estaActiva?: boolean;
}

// ==================== UPDATE DTO ====================
export class UpdateFaqDto extends PartialType(CreateFaqDto) {}

// ==================== FILTER WHERE INPUT ====================
class FaqWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  pregunta?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  respuesta?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  categoria?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  orden?: IntFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActiva?: BoolFilter;
}

// ==================== SELECT INPUT ====================
class FaqSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  pregunta?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  respuesta?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  categoria?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  orden?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActiva?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaCreacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaActualizacion?: boolean;
}

// ==================== LIST ARGS DTO ====================
export class ListFaqArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: FaqWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => FaqWhereInput)
  where?: FaqWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: FaqSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => FaqSelectInput)
  select?: FaqSelectInput;
}
