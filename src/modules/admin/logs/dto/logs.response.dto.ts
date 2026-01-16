import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LoginAttempt } from '../entities/login-attempt.entity';
import { ErrorLog } from '../entities/error-log.entity';
import { AccessLog } from '../entities/access-log.entity';
import { DataChangeLog } from '../entities/data-change-log.entity';
import { AuditLog } from '../entities/audig-log.entity';
import { SystemLog } from '../system-log.entity';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../common/dtos/response.dto';

// ============================================
// AUDIT LOGS RESPONSES
// ============================================

class PaginateAuditLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de auditoría', type: [AuditLog] })
  data?: AuditLog[];
}

export class PaginateAuditLogsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateAuditLogsData })
  declare response: PaginateAuditLogsData;
}

// ============================================
// SYSTEM LOGS RESPONSES
// ============================================

class PaginateSystemLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de sistema', type: [SystemLog] })
  data?: SystemLog[];
}

export class PaginateSystemLogsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateSystemLogsData })
  declare response: PaginateSystemLogsData;
}

// ============================================
// LOGIN ATTEMPTS RESPONSES
// ============================================

class PaginateLoginAttemptsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de intentos de login', type: [LoginAttempt] })
  data?: LoginAttempt[];
}

export class PaginateLoginAttemptsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateLoginAttemptsData })
  declare response: PaginateLoginAttemptsData;
}

// ============================================
// ERROR LOGS RESPONSES
// ============================================

class PaginateErrorLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de errores', type: [ErrorLog] })
  data?: ErrorLog[];
}

export class PaginateErrorLogsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateErrorLogsData })
  declare response: PaginateErrorLogsData;
}

// ============================================
// ACCESS LOGS RESPONSES
// ============================================

class PaginateAccessLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de acceso', type: [AccessLog] })
  data?: AccessLog[];
}

export class PaginateAccessLogsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateAccessLogsData })
  declare response: PaginateAccessLogsData;
}

// ============================================
// AUDIT STATS RESPONSE
// ============================================

export class AuditLogStats {
  @ApiProperty()
  totalAcciones: number;

  @ApiProperty()
  accionesPorTipo: Record<string, number>;

  @ApiProperty({ type: [Object] })
  modulosMasActivos: Array<{ modulo: string; count: number }>;

  @ApiProperty({ type: [Object] })
  usuariosMasActivos: Array<{ usuarioEmail: string; count: number }>;
}

class AuditStatsData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: AuditLogStats })
  data: AuditLogStats;
}

export class ResponseAuditStatsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: AuditStatsData })
  declare response: AuditStatsData;
}

// ============================================
// DATA CHANGE HISTORY RESPONSE
// ============================================

export class DataChangeHistoryItem {
  @ApiProperty()
  campo: string;

  @ApiProperty({ required: false })
  valorAnterior?: string;

  @ApiProperty({ required: false })
  valorNuevo?: string;

  @ApiProperty()
  fechaCambio: Date;

  @ApiProperty()
  usuarioEmail: string;
}

export class DataChangeHistory {
  @ApiProperty()
  tabla: string;

  @ApiProperty()
  registroId: string;

  @ApiProperty({ type: [DataChangeHistoryItem] })
  historial: DataChangeHistoryItem[];
}

class DataChangeHistoryData extends OmitType(ResponseStructDTO, [
  'pagination',
  'validationErrors',
]) {
  @ApiProperty({ type: DataChangeHistory })
  data: DataChangeHistory;
}

export class ResponseDataChangeHistoryType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DataChangeHistoryData })
  declare response: DataChangeHistoryData;
}
