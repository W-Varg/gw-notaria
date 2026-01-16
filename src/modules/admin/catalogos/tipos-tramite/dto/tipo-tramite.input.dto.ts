import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { BoolFilter } from '../../../../../common/dtos/prisma/bool-filter.input';
import { StringFilter } from '../../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';

export class CreateTipoTramiteDto {
  @Expose()
  @IsDefined()
  @IsNumber()
  @ApiProperty({ type: Number })
  sucursalId: number;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
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
  @MaxLength(15)
  @ApiPropertyOptional({ type: String, default: '#1abc9c' })
  colorHex?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(15)
  @ApiPropertyOptional({ type: String, default: 'pi pi-code' })
  icon?: string;

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
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({ type: String })
  negocio?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  imagen?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ type: Number, default: 0 })
  costoBase?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  estaActiva?: boolean;
}

export class UpdateTipoTramiteDto extends PartialType(CreateTipoTramiteDto) {}

class TipoTramiteWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  sucursalId?: number;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipoDocumentoId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  descripcion?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  claseTramite?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  negocio?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActiva?: BoolFilter;
}

class TipoTramiteSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  tipoDocumentoId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  colorHex?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  icon?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  descripcion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  claseTramite?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  negocio?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  imagen?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActiva?: boolean;
}

export class ListTipoTramiteArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: TipoTramiteWhereInput })
  @IsOptional()
  @Type(() => TipoTramiteWhereInput)
  @Expose()
  where?: TipoTramiteWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: TipoTramiteSelectInput })
  @IsOptional()
  @Type(() => TipoTramiteSelectInput)
  @Expose()
  select?: TipoTramiteSelectInput;
}
