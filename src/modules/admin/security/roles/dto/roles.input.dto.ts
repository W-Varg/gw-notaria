import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';
import { RolPermisoSelect } from './rol-pemiso.input.dto';

export class CreateRolDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @ApiProperty({ type: String })
  @Expose()
  nombre: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiPropertyOptional({ type: String })
  @Expose()
  descripcion?: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({ type: [Number] })
  @Expose()
  permisosIds?: number[];
}

export class UpdateRoleDto extends PartialType(CreateRolDto) {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActivo?: boolean;
}

class RolWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  @Expose()
  descripcion?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  estaActivo?: BoolFilter;
}

export class RolSelectInput {
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
  estaActivo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaCreacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaActualizacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: () => RolPermisoSelect })
  @IsOptional()
  @ValidateNested()
  @Type(() => RolPermisoSelect)
  @Expose()
  rolPermisos?: RolPermisoSelect;
}

export class ListRoleArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: RolWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => RolWhereInput)
  @Expose()
  where?: RolWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: RolSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => RolSelectInput)
  @Expose()
  select?: RolSelectInput;
}
