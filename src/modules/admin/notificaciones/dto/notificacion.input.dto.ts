import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseFilterDto } from '../../../../common/dtos/filters.dto';
import { StringFilter } from '../../../../common/dtos/prisma/string-filter.input';
import { StringNullableFilter } from '../../../../common/dtos/prisma/string-nullable-filter.input';
import { BoolFilter } from '../../../../common/dtos/prisma/bool-filter.input';
import { DateTimeFilter } from '../../../../common/dtos/prisma/date-time-filter.input';

// ==================== CREATE DTO ====================
export class CreateNotificacionDto {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: 'ID del usuario destinatario' })
  usuarioId: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty({ type: String, description: 'Título de la notificación' })
  titulo: string;

  @Expose()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @ApiProperty({ type: String, description: 'Mensaje de la notificación' })
  mensaje: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsIn(['info', 'warning', 'success', 'error'])
  @ApiPropertyOptional({
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info',
    description: 'Tipo de notificación',
  })
  tipo?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'Estado de lectura',
  })
  leida?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    type: String,
    description: 'Icono de PrimeIcons (ej: pi-check-circle)',
  })
  icono?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({
    type: String,
    description: 'Ruta de navegación asociada',
  })
  ruta?: string;
}

// ==================== UPDATE DTO ====================
export class UpdateNotificacionDto extends PartialType(CreateNotificacionDto) {}

// ==================== FILTER WHERE INPUT ====================
class NotificacionWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  usuarioId?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  titulo?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  mensaje?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipo?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  leida?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  icono?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  ruta?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCreacion?: DateTimeFilter;
}

// ==================== SELECT INPUT ====================
class NotificacionSelectInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  id?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  usuarioId?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  titulo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  mensaje?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  tipo?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  leida?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  icono?: boolean;

  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  @IsBoolean()
  ruta?: boolean;

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
export class ListNotificacionArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: NotificacionWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificacionWhereInput)
  where?: NotificacionWhereInput;

  @Expose()
  @ApiPropertyOptional({ type: NotificacionSelectInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificacionSelectInput)
  select?: NotificacionSelectInput;
}
