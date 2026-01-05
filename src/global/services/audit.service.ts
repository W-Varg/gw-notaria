import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { TipoAccionEnum } from '../../enums/tipo-accion.enum';
import { NivelLogEnum } from '../../enums/nivel-log.enum';

export interface AuditLogData {
  accion: TipoAccionEnum;
  modulo: string;
  tabla?: string;
  registroId?: string;
  descripcion: string;
  usuarioId?: string;
  usuarioEmail?: string;
  usuarioNombre?: string;
  usuarioIp?: string;
  userAgent?: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  cambiosRealizados?: any;
  metadatos?: any;
  duracionMs?: number;
  exitoso?: boolean;
  mensajeError?: string;
}

export interface SystemLogData {
  nivel: NivelLogEnum;
  mensaje: string;
  contexto?: string;
  modulo?: string;
  stackTrace?: string;
  metadatos?: any;
  usuarioId?: string;
  usuarioEmail?: string;
  metodoHttp?: string;
  url?: string;
  requestBody?: any;
  responseCode?: number;
  duracionMs?: number;
}

export interface LoginAttemptData {
  email: string;
  exitoso: boolean;
  motivoFallo?: string;
  ip: string;
  userAgent?: string;
  ubicacion?: string;
  dispositivo?: string;
  navegador?: string;
  intentosSospechoso?: boolean;
  bloqueado?: boolean;
}

export interface AccessLogData {
  usuarioId?: string;
  usuarioEmail?: string;
  recurso: string;
  metodoHttp: string;
  url: string;
  endpoint?: string;
  requestBody?: any;
  queryParams?: any;
  responseCode: number;
  responseBody?: any;
  duracionMs: number;
  ip: string;
  userAgent?: string;
}

export interface DataChangeLogData {
  tabla: string;
  registroId: string;
  campo: string;
  valorAnterior?: string;
  valorNuevo?: string;
  tipoCambio: string;
  usuarioId?: string;
  usuarioEmail?: string;
  usuarioNombre?: string;
  razonCambio?: string;
  ipOrigen?: string;
}

export interface ErrorLogData {
  mensaje: string;
  tipo: string;
  codigo?: string;
  severidad: string;
  stackTrace: string;
  contexto?: string;
  modulo?: string;
  metodoHttp?: string;
  url?: string;
  requestBody?: any;
  usuarioId?: string;
  usuarioEmail?: string;
  ip?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registrar un log de auditoría
   */
  async logAudit(data: AuditLogData) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          accion: data.accion,
          modulo: data.modulo,
          tabla: data.tabla,
          registroId: data.registroId,
          descripcion: data.descripcion,
          usuarioId: data.usuarioId,
          usuarioEmail: data.usuarioEmail,
          usuarioNombre: data.usuarioNombre,
          usuarioIp: data.usuarioIp,
          userAgent: data.userAgent,
          datosAnteriores: data.datosAnteriores as Prisma.InputJsonValue,
          datosNuevos: data.datosNuevos as Prisma.InputJsonValue,
          cambiosRealizados: data.cambiosRealizados as Prisma.InputJsonValue,
          metadatos: data.metadatos as Prisma.InputJsonValue,
          duracionMs: data.duracionMs,
          exitoso: data.exitoso ?? true,
          mensajeError: data.mensajeError,
        },
      });
    } catch (error) {
      console.error('Error al registrar audit log:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  /**
   * Registrar un log de sistema
   */
  async logSystem(data: SystemLogData) {
    try {
      return await this.prisma.systemLog.create({
        data: {
          nivel: data.nivel,
          mensaje: data.mensaje,
          contexto: data.contexto,
          modulo: data.modulo,
          stackTrace: data.stackTrace,
          metadatos: data.metadatos as Prisma.InputJsonValue,
          usuarioId: data.usuarioId,
          usuarioEmail: data.usuarioEmail,
          metodoHttp: data.metodoHttp,
          url: data.url,
          requestBody: data.requestBody as Prisma.InputJsonValue,
          responseCode: data.responseCode,
          duracionMs: data.duracionMs,
        },
      });
    } catch (error) {
      console.error('Error al registrar system log:', error);
    }
  }

  /**
   * Registrar intento de login
   */
  async logLoginAttempt(data: LoginAttemptData) {
    try {
      return await this.prisma.loginAttempt.create({
        data: {
          email: data.email,
          exitoso: data.exitoso,
          motivoFallo: data.motivoFallo,
          ip: data.ip,
          userAgent: data.userAgent,
          ubicacion: data.ubicacion,
          dispositivo: data.dispositivo,
          navegador: data.navegador,
          intentosSospechoso: data.intentosSospechoso ?? false,
          bloqueado: data.bloqueado ?? false,
        },
      });
    } catch (error) {
      console.error('Error al registrar login attempt:', error);
    }
  }

  /**
   * Registrar acceso a recurso
   */
  async logAccess(data: AccessLogData) {
    try {
      return await this.prisma.accessLog.create({
        data: {
          usuarioId: data.usuarioId,
          usuarioEmail: data.usuarioEmail,
          recurso: data.recurso,
          metodoHttp: data.metodoHttp,
          url: data.url,
          endpoint: data.endpoint,
          requestBody: data.requestBody as Prisma.InputJsonValue,
          queryParams: data.queryParams as Prisma.InputJsonValue,
          responseCode: data.responseCode,
          responseBody: data.responseBody as Prisma.InputJsonValue,
          duracionMs: data.duracionMs,
          ip: data.ip,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      console.error('Error al registrar access log:', error);
    }
  }

  /**
   * Registrar cambio de datos
   */
  async logDataChange(data: DataChangeLogData) {
    try {
      return await this.prisma.dataChangeLog.create({
        data: {
          tabla: data.tabla,
          registroId: data.registroId,
          campo: data.campo,
          valorAnterior: data.valorAnterior,
          valorNuevo: data.valorNuevo,
          tipoCambio: data.tipoCambio,
          usuarioId: data.usuarioId,
          usuarioEmail: data.usuarioEmail,
          usuarioNombre: data.usuarioNombre,
          razonCambio: data.razonCambio,
          ipOrigen: data.ipOrigen,
        },
      });
    } catch (error) {
      console.error('Error al registrar data change log:', error);
    }
  }

  /**
   * Registrar error
   */
  async logError(data: ErrorLogData) {
    try {
      return await this.prisma.errorLog.create({
        data: {
          mensaje: data.mensaje,
          tipo: data.tipo,
          codigo: data.codigo,
          severidad: data.severidad,
          stackTrace: data.stackTrace,
          contexto: data.contexto,
          modulo: data.modulo,
          metodoHttp: data.metodoHttp,
          url: data.url,
          requestBody: data.requestBody as Prisma.InputJsonValue,
          usuarioId: data.usuarioId,
          usuarioEmail: data.usuarioEmail,
          ip: data.ip,
        },
      });
    } catch (error) {
      console.error('Error al registrar error log:', error);
    }
  }

  /**
   * Comparar objetos y generar resumen de cambios
   */
  compararCambios(datosAnteriores: any, datosNuevos: any): any {
    const cambios: any = {};

    if (!datosAnteriores) return datosNuevos;
    if (!datosNuevos) return null;

    const todasLasClaves = new Set([...Object.keys(datosAnteriores), ...Object.keys(datosNuevos)]);

    for (const clave of todasLasClaves) {
      const valorAnterior = datosAnteriores[clave];
      const valorNuevo = datosNuevos[clave];

      // Ignorar campos de timestamps y metadata si no han cambiado significativamente
      if (['fechaActualizacion', 'updatedAt', 'fechaCreacion', 'createdAt'].includes(clave)) {
        continue;
      }

      if (JSON.stringify(valorAnterior) !== JSON.stringify(valorNuevo)) {
        cambios[clave] = {
          anterior: valorAnterior,
          nuevo: valorNuevo,
        };
      }
    }

    return Object.keys(cambios).length > 0 ? cambios : null;
  }

  /**
   * Registrar cambios detallados campo por campo
   */
  async registrarCambiosDetallados(
    tabla: string,
    registroId: string,
    datosAnteriores: any,
    datosNuevos: any,
    usuarioId?: string,
    usuarioEmail?: string,
    usuarioNombre?: string,
    ipOrigen?: string,
  ) {
    const cambios = this.compararCambios(datosAnteriores, datosNuevos);
    if (!cambios) return;

    const promesas = Object.entries(cambios).map(([campo, valores]: [string, any]) =>
      this.logDataChange({
        tabla,
        registroId,
        campo,
        valorAnterior: JSON.stringify(valores.anterior),
        valorNuevo: JSON.stringify(valores.nuevo),
        tipoCambio: 'UPDATE',
        usuarioId,
        usuarioEmail,
        usuarioNombre,
        ipOrigen,
      }),
    );

    await Promise.allSettled(promesas);
  }
}
