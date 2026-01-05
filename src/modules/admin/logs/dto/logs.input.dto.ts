import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { NivelLogEnum } from 'src/enums/nivel-log.enum';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import {
  BaseFilterDto,
  StringFilter,
  StringNullableFilter,
  DateTimeFilter,
  BoolFilter,
} from 'src/common/dtos';

// ============================================
// WHERE INPUTS (Filtros)
// ============================================

class AuditLogWhereInput {
  @Expose()
  @ApiPropertyOptional({ enum: TipoAccionEnum })
  @IsOptional()
  @IsEnum(TipoAccionEnum)
  accion?: TipoAccionEnum;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  modulo?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  tabla?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioEmail?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCreacion?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  exitoso?: BoolFilter;
}

class SystemLogWhereInput {
  @Expose()
  @ApiPropertyOptional({ enum: NivelLogEnum })
  @IsOptional()
  @IsEnum(NivelLogEnum)
  nivel?: NivelLogEnum;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  modulo?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaCreacion?: DateTimeFilter;
}

class LoginAttemptWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  email?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  ip?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  exitoso?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaIntento?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  intentosSospechoso?: BoolFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  bloqueado?: BoolFilter;
}

class ErrorLogWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  tipo?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  severidad?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  modulo?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaError?: DateTimeFilter;

  @Expose()
  @ApiPropertyOptional({ type: BoolFilter })
  @IsOptional()
  @Type(() => BoolFilter)
  resuelto?: BoolFilter;
}

class AccessLogWhereInput {
  @Expose()
  @ApiPropertyOptional({ type: StringNullableFilter })
  @IsOptional()
  @Type(() => StringNullableFilter)
  usuarioId?: StringNullableFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  recurso?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: StringFilter })
  @IsOptional()
  @Type(() => StringFilter)
  metodoHttp?: StringFilter;

  @Expose()
  @ApiPropertyOptional({ type: DateTimeFilter })
  @IsOptional()
  @Type(() => DateTimeFilter)
  fechaAcceso?: DateTimeFilter;
}

// ============================================
// LIST ARGS DTOs (Con filtros y paginación)
// ============================================

export class ListAuditLogsArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: AuditLogWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => AuditLogWhereInput)
  where?: AuditLogWhereInput;
}

export class ListSystemLogsArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: SystemLogWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => SystemLogWhereInput)
  where?: SystemLogWhereInput;
}

export class ListLoginAttemptsArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: LoginAttemptWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => LoginAttemptWhereInput)
  where?: LoginAttemptWhereInput;
}

export class ListErrorLogsArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: ErrorLogWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => ErrorLogWhereInput)
  where?: ErrorLogWhereInput;
}

export class ListAccessLogsArgsDto extends BaseFilterDto {
  @Expose()
  @ApiPropertyOptional({ type: AccessLogWhereInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccessLogWhereInput)
  where?: AccessLogWhereInput;
}

// ============================================
// QUERY DTOs (Para historial de cambios)
// ============================================

export class GetDataChangeHistoryDto {
  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  tabla: string;

  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  registroId: string;
}
