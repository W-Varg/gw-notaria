import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BaseFilterDto } from '../../../../../common/dtos/filters.dto';
import { BoolFilter } from '../../../../../common/dtos/prisma/bool-filter.input';
import { StringFilter } from '../../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../../common/dtos/prisma/string-nullable-filter.input';
import { UsuarioRolSelect } from './usuario-rol.input.dto';

export class CreateUsuarioDto {
  @Expose()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(6)
  @ApiProperty({ type: String })
  @Expose()
  password: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String })
  @Expose()
  nombre: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String })
  @Expose()
  apellidos: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Expose()
  telefono?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Expose()
  direccion?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Avatar del usuario',
    type: String,
    format: 'binary',
  })
  @Expose()
  avatar?: Express.Multer.File;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    type: Number,
    description: 'ID de la sucursal a la que pertenece el usuario',
  })
  @Expose()
  sucursalId?: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada roleId debe ser un número' })
  @ApiPropertyOptional({ description: 'Array de IDs de roles', example: '[1,2]', type: [Number] })
  @Transform(({ value }) => value?.map((id: number) => id * 1))
  @Expose()
  rolesIds?: number[];

  @Expose()
  @Transform(({ obj, value }) => {
    if (obj.estaActivo === 'true') return true;
    if (obj.estaActivo === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  estaActivo?: boolean;
}

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['avatar', 'password'] as const),
) {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Expose()
  emailVerificado?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({ type: String, description: 'Contraseña (opcional al actualizar)' })
  @Expose()
  password?: string;
}

class UsuarioWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  @Expose()
  email?: StringFilter;

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
  apellidos?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  @Expose()
  telefono?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  @Expose()
  direccion?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  estaActivo?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  @Expose()
  emailVerificado?: BoolFilter;
}

export class UsuarioSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  email?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  nombre?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  apellidos?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  telefono?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  direccion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  avatar?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  estaActivo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  emailVerificado?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaCreacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  fechaActualizacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: () => UsuarioRolSelect })
  @IsOptional()
  @ValidateNested()
  @Type(() => UsuarioRolSelect)
  roles?: UsuarioRolSelect;
}

export class ListUsuarioArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: UsuarioWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => UsuarioWhereInput)
  @Expose()
  where?: UsuarioWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: UsuarioSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => UsuarioSelectInput)
  @Expose()
  select?: UsuarioSelectInput;
}

export class ResetPasswordDto {
  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(6)
  @ApiProperty({ type: String })
  nuevoPassword: string;
}
