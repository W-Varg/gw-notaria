import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { BoolFilter } from '../../../../../common/dtos/prisma/bool-filter.input';
import { IntFilter } from '../../../../../common/dtos/prisma/int-filter.input';
import { StringFilter } from '../../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';

export class CreateEstadoTramiteDto {
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
  @MaxLength(500)
  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(7)
  @ApiPropertyOptional({ type: String })
  colorHex?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ type: Number })
  orden?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActivo?: boolean;
}

export class UpdateEstadoTramiteDto extends PartialType(CreateEstadoTramiteDto) {}

class EstadoTramiteWhereInput {
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
  colorHex?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: IntFilter })
  @IsOptional()
  @Type(() => IntFilter)
  orden?: IntFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActivo?: BoolFilter;
}

class EstadoTramiteSelectInput {
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
  colorHex?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  orden?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActivo?: boolean;
}

export class ListEstadoTramiteArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: EstadoTramiteWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => EstadoTramiteWhereInput)
  where?: EstadoTramiteWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: EstadoTramiteSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => EstadoTramiteSelectInput)
  select?: EstadoTramiteSelectInput;
}
