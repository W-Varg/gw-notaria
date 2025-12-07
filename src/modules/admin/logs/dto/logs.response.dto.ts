import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  LoginAttempt,
  ErrorLog,
  AccessLog,
  DataChangeLog,
} from 'src/generated/prisma/client';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { AuditLog } from '../audig-log.entity';

// ============================================
// AUDIT LOGS RESPONSES
// ============================================

class PaginateAuditLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de auditoría', isArray: true })
  data?: any[];
}

export class PaginateAuditLogsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateAuditLogsData })
  declare response: PaginateAuditLogsData;
}

// ============================================
// SYSTEM LOGS RESPONSES
// ============================================

class PaginateSystemLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de sistema', isArray: true })
  data?: any[];
}

export class PaginateSystemLogsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateSystemLogsData })
  declare response: PaginateSystemLogsData;
}

// ============================================
// LOGIN ATTEMPTS RESPONSES
// ============================================

class PaginateLoginAttemptsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de intentos de login', isArray: true })
  data?: any[];
}

export class PaginateLoginAttemptsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateLoginAttemptsData })
  declare response: PaginateLoginAttemptsData;
}

// ============================================
// ERROR LOGS RESPONSES
// ============================================

class PaginateErrorLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de errores', isArray: true })
  data?: any[];
}

export class PaginateErrorLogsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateErrorLogsData })
  declare response: PaginateErrorLogsData;
}

// ============================================
// ACCESS LOGS RESPONSES
// ============================================

class PaginateAccessLogsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ description: 'Lista de logs de acceso', isArray: true })
  data?: any[];
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

export class DataChangeHistory {
  @ApiProperty()
  tabla: string;

  @ApiProperty()
  registroId: string;

  @ApiProperty({ type: [Object] })
  historial: Array<{
    campo: string;
    valorAnterior: string;
    valorNuevo: string;
    fechaCambio: Date;
    usuarioEmail: string;
  }>;
}

class DataChangeHistoryData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: DataChangeHistory })
  data: DataChangeHistory;
}

export class ResponseDataChangeHistoryType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DataChangeHistoryData })
  declare response: DataChangeHistoryData;
}
