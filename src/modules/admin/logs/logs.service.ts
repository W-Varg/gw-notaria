import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  ListAuditLogsArgsDto,
  ListSystemLogsArgsDto,
  ListLoginAttemptsArgsDto,
  ListErrorLogsArgsDto,
  ListAccessLogsArgsDto,
} from './dto/logs.input.dto';
import { Prisma } from 'src/generated/prisma/client';
import { dataResponseSuccess } from 'src/common/dtos/response.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener logs de auditoría con filtros
   */
  async getAuditLogs(filters: ListAuditLogsArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(filters, true);
    const { accion, modulo, tabla, usuarioId, usuarioEmail, fechaCreacion, exitoso } =
      filters.where || {};
    const whereInput: Prisma.AuditLogWhereInput = {};

    if (accion) whereInput.accion = accion;
    if (modulo) whereInput.modulo = modulo;
    if (tabla) whereInput.tabla = tabla;
    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (usuarioEmail) whereInput.usuarioEmail = usuarioEmail;
    if (fechaCreacion) whereInput.fechaCreacion = fechaCreacion;
    if (exitoso !== undefined) whereInput.exitoso = exitoso;

    const [list, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaCreacion: 'desc' },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true,
              apellidos: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where: whereInput }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  /**
   * Obtener logs de sistema
   */
  async getSystemLogs(filters: ListSystemLogsArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(filters, true);
    const { nivel, modulo, usuarioId, fechaCreacion } = filters.where || {};
    const whereInput: Prisma.SystemLogWhereInput = {};

    if (nivel) whereInput.nivel = nivel;
    if (modulo) whereInput.modulo = modulo;
    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (fechaCreacion) whereInput.fechaCreacion = fechaCreacion;

    const [list, total] = await Promise.all([
      this.prisma.systemLog.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaCreacion: 'desc' },
      }),
      this.prisma.systemLog.count({ where: whereInput }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  /**
   * Obtener intentos de login
   */
  async getLoginAttempts(filters: ListLoginAttemptsArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(filters, true);
    const { email, ip, exitoso, fechaIntento } = filters.where || {};
    const whereInput: Prisma.LoginAttemptWhereInput = {};

    if (email) whereInput.email = email;
    if (ip) whereInput.ip = ip;
    if (exitoso !== undefined) whereInput.exitoso = exitoso;
    if (fechaIntento) whereInput.fechaIntento = fechaIntento;

    const [list, total] = await Promise.all([
      this.prisma.loginAttempt.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaIntento: 'desc' },
      }),
      this.prisma.loginAttempt.count({ where: whereInput }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  /**
   * Obtener logs de errores
   */
  async getErrorLogs(filters: ListErrorLogsArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(filters, true);
    const { tipo, severidad, modulo, fechaError, resuelto } = filters.where || {};
    const whereInput: Prisma.ErrorLogWhereInput = {};

    if (tipo) whereInput.tipo = tipo;
    if (severidad) whereInput.severidad = severidad;
    if (modulo) whereInput.modulo = modulo;
    if (fechaError) whereInput.fechaError = fechaError;
    if (resuelto !== undefined) whereInput.resuelto = resuelto;

    const [list, total] = await Promise.all([
      this.prisma.errorLog.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaError: 'desc' },
      }),
      this.prisma.errorLog.count({ where: whereInput }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  /**
   * Obtener logs de acceso
   */
  async getAccessLogs(filters: ListAccessLogsArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(filters, true);
    const { recurso, metodoHttp, usuarioId, fechaAcceso } = filters.where || {};
    const whereInput: Prisma.AccessLogWhereInput = {};

    if (recurso) whereInput.recurso = recurso;
    if (metodoHttp) whereInput.metodoHttp = metodoHttp;
    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (fechaAcceso) whereInput.fechaAcceso = fechaAcceso;

    const [list, total] = await Promise.all([
      this.prisma.accessLog.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaAcceso: 'desc' },
      }),
      this.prisma.accessLog.count({ where: whereInput }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  /**
   * Obtener estadísticas de auditoría
   */
  async getAuditStats() {
    const [totalAcciones, accionesPorTipo, modulosMasActivos, usuariosMasActivos] =
      await Promise.all([
        this.prisma.auditLog.count(),
        this.prisma.auditLog.groupBy({
          by: ['accion'],
          _count: true,
        }),
        this.prisma.auditLog.groupBy({
          by: ['modulo'],
          _count: true,
          orderBy: { _count: { modulo: 'desc' } },
          take: 10,
        }),
        this.prisma.auditLog.groupBy({
          by: ['usuarioEmail'],
          _count: true,
          orderBy: { _count: { usuarioEmail: 'desc' } },
          where: { usuarioEmail: { not: null } },
          take: 10,
        }),
      ]);

    return dataResponseSuccess({
      data: {
        totalAcciones,
        accionesPorTipo: Object.fromEntries(
          accionesPorTipo.map((item) => [item.accion, item._count]),
        ),
        modulosMasActivos: modulosMasActivos.map((item) => ({
          modulo: item.modulo,
          count: item._count,
        })),
        usuariosMasActivos: usuariosMasActivos.map((item) => ({
          usuarioEmail: item.usuarioEmail,
          count: item._count,
        })),
      },
    });
  }

  /**
   * Obtener historial de cambios para un registro específico
   */
  async getDataChangeHistory(tabla: string, registroId: string) {
    const cambios = await this.prisma.dataChangeLog.findMany({
      where: { tabla, registroId },
      orderBy: { fechaCambio: 'desc' },
    });

    return dataResponseSuccess({
      data: {
        tabla,
        registroId,
        historial: cambios.map((cambio) => ({
          campo: cambio.campo,
          valorAnterior: cambio.valorAnterior,
          valorNuevo: cambio.valorNuevo,
          fechaCambio: cambio.fechaCambio,
          usuarioEmail: cambio.usuarioEmail || 'Sistema',
        })),
      },
    });
  }
}
