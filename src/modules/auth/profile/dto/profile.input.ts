import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import {
  BaseFilterDto,
  BoolFilter,
  DateTimeFilter,
  StringNullableFilter,
} from '../../../../common/dtos';

/**
 * DTO para actualizar perfil de usuario
 */
export class UpdateProfileInput {
  @Expose()
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nombre?: string;

  @Expose()
  @ApiProperty({ description: 'Apellidos del usuario', example: 'Pérez García', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  apellidos?: string;

  @Expose()
  @ApiProperty({ description: 'Teléfono del usuario', example: '70123456', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  telefono?: string;

  @Expose()
  @ApiProperty({ description: 'Dirección del usuario', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;
}

/**
 * DTO para verificar contraseña
 */
export class VerifyPasswordInput {
  @Expose()
  @ApiProperty({ description: 'Contraseña a verificar', example: 'Password123!' })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

/**
 * WhereInput para filtrar historial de login
 */
class HistorialLoginWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: BoolFilter, description: 'Filtro para login exitoso' })
  @IsOptional()
  @Type(() => BoolFilter)
  exitoso?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter, description: 'Filtro para dirección IP' })
  @IsOptional()
  @Type(() => StringNullableFilter)
  ipAddress?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter, description: 'Filtro para user agent' })
  @IsOptional()
  @Type(() => StringNullableFilter)
  userAgent?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter, description: 'Filtro para dispositivo' })
  @IsOptional()
  @Type(() => StringNullableFilter)
  dispositivo?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter, description: 'Filtro para navegador' })
  @IsOptional()
  @Type(() => StringNullableFilter)
  navegador?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter, description: 'Filtro para ubicación' })
  @IsOptional()
  @Type(() => StringNullableFilter)
  ubicacion?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter, description: 'Filtro para motivo de fallo' })
  @IsOptional()
  @Type(() => StringNullableFilter)
  motivoFallo?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter, description: 'Filtro para fecha de intento' })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaIntento?: DateTimeFilter;
}

/**
 * SelectInput para seleccionar campos del historial de login
 */
class HistorialLoginSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  exitoso?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  ipAddress?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  userAgent?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  dispositivo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  navegador?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  ubicacion?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  motivoFallo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  fechaIntento?: boolean;
}

/**
 * DTO para listar historial de login con filtros y paginación
 */
export class ListHistorialLoginArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({
    type: HistorialLoginWhereInput,
    description: 'Filtros para el historial de login',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => HistorialLoginWhereInput)
  where?: HistorialLoginWhereInput;

  @Expose()
  @ApiPropertyOptional({
    type: HistorialLoginSelectInput,
    description: 'Campos a seleccionar del historial de login',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => HistorialLoginSelectInput)
  select?: HistorialLoginSelectInput;
}
