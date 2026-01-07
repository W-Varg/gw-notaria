import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/filters.dto';
import { BoolFilter } from 'src/common/dtos/prisma/bool-filter.input';
import { StringFilter } from 'src/common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from 'src/common/dtos/prisma/string-nullable-filter.input';

export class CreateSucursalDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({ type: String, description: 'Nombre de la sucursal' })
  nombre: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @ApiProperty({ type: String, description: 'Abreviación de la sucursal' })
  abreviacion: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ type: String, description: 'Departamento donde se ubica' })
  departamento: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String, description: 'Dirección de la sucursal' })
  direccion: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ type: String, description: 'Teléfono de contacto' })
  telefono?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String, description: 'Email de contacto' })
  email?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'ID del usuario responsable' })
  usuarioResponsableId?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, default: true })
  estaActiva?: boolean;
}

export class UpdateSucursalDto extends PartialType(CreateSucursalDto) {}

class SucursalWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  nombre?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  abreviacion?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  departamento?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  telefono?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  email?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  estaActiva?: BoolFilter;
}

class SucursalSelectInput {
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
  abreviacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  departamento?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  direccion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  telefono?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  email?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  usuarioResponsableId?: boolean;

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
  @ApiPropertyOptional({ type: SucursalWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => SucursalWhereInput)
  where?: SucursalWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: SucursalSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => SucursalSelectInput)
  select?: SucursalSelectInput;
}
