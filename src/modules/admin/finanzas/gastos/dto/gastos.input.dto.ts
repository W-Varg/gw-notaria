import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { StringFilter } from '../../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';
import { FloatFilter } from '../../../../../common/dtos/prisma/float-filter.input';

export class CreateGastosDto {
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
  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String })
  proveedor?: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @ApiProperty({ type: Number })
  montoTotal: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  montoPagado?: number;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: String, format: 'date' })
  fechaGasto?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({ type: String })
  categoria?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  usuarioId?: string;
}

export class UpdateGastosDto extends PartialType(CreateGastosDto) {}

class GastosWhereInput {
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
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  proveedor?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  montoTotal?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: FloatFilter })
  @IsOptional()
  @Type(() => FloatFilter)
  montoPagado?: FloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  categoria?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioId?: StringNullableFilter;
}

class GastosSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  descripcion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  proveedor?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  montoTotal?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  montoPagado?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  saldo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  fechaGasto?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  categoria?: boolean;
}

export class ListGastosArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: GastosWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => GastosWhereInput)
  where?: GastosWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: GastosSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => GastosSelectInput)
  select?: GastosSelectInput;
}
