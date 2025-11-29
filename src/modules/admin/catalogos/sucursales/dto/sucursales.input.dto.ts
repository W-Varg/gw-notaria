import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto, OrderQueryDto, PaginationQueryDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';

export class CreateSucursalDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(150)
  @ApiProperty({ type: String })
  @Expose()
  nombre: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(250)
  @ApiProperty({ type: String })
  @Expose()
  direccion: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(120)
  @ApiProperty({ type: String })
  @Expose()
  ciudad: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String })
  @Expose()
  telefono?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Expose()
  latitud?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Expose()
  longitud?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActiva?: boolean;
}

export class UpdateSucursalDto extends PartialType(CreateSucursalDto) {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActiva?: boolean;
}

export class SucursalWhereInput extends IntersectionType(BaseFilterDto, PaginationQueryDto) {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Expose()
  nombre?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Expose()
  ciudad?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActiva?: boolean;
}

export class SucursalWhereInputAdvanced {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  direccion?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  ciudad?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  @Expose()
  telefono?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  estaActiva?: BoolFilter;
}

export class SucursalSelectInput {
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
  direccion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  ciudad?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  telefono?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  latitud?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  longitud?: boolean;

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

export class ListSucursalArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: SucursalWhereInputAdvanced })
  @IsOptional()
  @ValidateNested()
  @Type(() => SucursalWhereInputAdvanced)
  @Expose()
  where?: SucursalWhereInputAdvanced;

  @Expose()
  @ApiPropertyOptional({ type: SucursalSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => SucursalSelectInput)
  @Expose()
  select?: SucursalSelectInput;
}
