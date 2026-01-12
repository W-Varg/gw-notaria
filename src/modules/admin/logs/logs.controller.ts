import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { LogsService } from './logs.service';
import {
  ListAuditLogsArgsDto,
  ListSystemLogsArgsDto,
  ListLoginAttemptsArgsDto,
  ListErrorLogsArgsDto,
  ListAccessLogsArgsDto,
  GetDataChangeHistoryDto,
} from './dto/logs.input.dto';
import {
  PaginateAuditLogsType,
  PaginateSystemLogsType,
  PaginateLoginAttemptsType,
  PaginateErrorLogsType,
  PaginateAccessLogsType,
  ResponseAuditStatsType,
  ResponseDataChangeHistoryType,
} from './dto/logs.response.dto';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';

@ApiTags('[admin] Logs y Auditoría')
@Controller('admin/logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('audit/list')
  @BearerAuthPermision([PermisoEnum.LOGS_VER])
  @ApiDescription('Servicio post con filtros y paginado de logs de auditoría', [
    PermisoEnum.LOGS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateAuditLogsType })
  async listAuditLogs(@Body() inputDto: ListAuditLogsArgsDto) {
    return await this.logsService.getAuditLogs(inputDto);
  }

  @Post('system/list')
  @BearerAuthPermision([PermisoEnum.LOGS_VER])
  @ApiDescription('Servicio post con filtros y paginado de logs de sistema', [PermisoEnum.LOGS_VER])
  @ApiResponse({ status: 200, type: () => PaginateSystemLogsType })
  async listSystemLogs(@Body() inputDto: ListSystemLogsArgsDto) {
    return await this.logsService.getSystemLogs(inputDto);
  }

  @Post('login-attempts/list')
  @BearerAuthPermision([PermisoEnum.LOGS_VER])
  @ApiDescription('Servicio post con filtros y paginado de intentos de login', [
    PermisoEnum.LOGS_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateLoginAttemptsType })
  async listLoginAttempts(@Body() inputDto: ListLoginAttemptsArgsDto) {
    return await this.logsService.getLoginAttempts(inputDto);
  }

  @Post('errors/list')
  @BearerAuthPermision([PermisoEnum.LOGS_VER])
  @ApiDescription('Servicio post con filtros y paginado de logs de errores', [PermisoEnum.LOGS_VER])
  @ApiResponse({ status: 200, type: () => PaginateErrorLogsType })
  async listErrorLogs(@Body() inputDto: ListErrorLogsArgsDto) {
    return await this.logsService.getErrorLogs(inputDto);
  }

  @Post('access/list')
  @BearerAuthPermision([PermisoEnum.LOGS_VER])
  @ApiDescription('Servicio post con filtros y paginado de logs de acceso', [PermisoEnum.LOGS_VER])
  @ApiResponse({ status: 200, type: () => PaginateAccessLogsType })
  async listAccessLogs(@Body() inputDto: ListAccessLogsArgsDto) {
    return await this.logsService.getAccessLogs(inputDto);
  }

  @Get('audit/stats')
  @BearerAuthPermision([PermisoEnum.LOGS_VER])
  @ApiDescription('Obtener estadísticas de auditoría', [PermisoEnum.LOGS_VER])
  @ApiResponse({ status: 200, type: () => ResponseAuditStatsType })
  async getAuditStats() {
    return await this.logsService.getAuditStats();
  }

  @Post('data-changes')
  @BearerAuthPermision([PermisoEnum.LOGS_VER])
  @ApiDescription('Obtener historial de cambios de un registro', [PermisoEnum.LOGS_VER])
  @ApiResponse({ status: 200, type: () => ResponseDataChangeHistoryType })
  async getDataChangeHistory(@Body() inputDto: GetDataChangeHistoryDto) {
    return await this.logsService.getDataChangeHistory(inputDto.tabla, inputDto.registroId);
  }
}
