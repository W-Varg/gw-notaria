import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AUDIT_KEY, AuditMetadata } from 'src/common/decorators/audit.decorator';
import { TipoAccionEnum } from '../../enums/tipo-accion.enum';
import { AuditService } from 'src/global/services/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMetadata = this.reflector.get<AuditMetadata>(AUDIT_KEY, context.getHandler());

    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    // Extraer información del usuario y request
    const usuario = request.user;
    const usuarioId = usuario?.sub || usuario?.id;
    const usuarioEmail = usuario?.email;
    const usuarioNombre = usuario?.nombre
      ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim()
      : undefined;
    const usuarioIp = request.ip || request.headers['x-forwarded-for'] || 'unknown';
    const userAgent = request.headers['user-agent'];

    // Capturar datos del request para análisis
    const datosRequest = {
      params: request.params,
      query: request.query,
      body: request.body,
    };

    return next.handle().pipe(
      tap(async (response) => {
        const duracionMs = Date.now() - startTime;

        // Extraer información del resultado
        let registroId: string | undefined;
        let datosNuevos: any;
        let datosAnteriores: any;

        if (response?.response?.data) {
          const data = response.response.data;
          registroId = data.id?.toString();
          datosNuevos = data;
        } else if (response?.id) {
          registroId = response.id.toString();
          datosNuevos = response;
        }

        // Para operaciones UPDATE, intentar obtener datos anteriores del body
        if (auditMetadata.accion === TipoAccionEnum.UPDATE && datosRequest.body?._previousData) {
          datosAnteriores = datosRequest.body._previousData;
          delete datosRequest.body._previousData;
        }

        // Calcular cambios realizados
        const cambiosRealizados =
          datosAnteriores && datosNuevos
            ? this.auditService.compararCambios(datosAnteriores, datosNuevos)
            : null;

        // Generar descripción automática si no se proporcionó
        const descripcion =
          auditMetadata.descripcion ||
          this.generarDescripcionAutomatica(auditMetadata.accion, auditMetadata.modulo, registroId);

        // Registrar en audit log
        await this.auditService.logAudit({
          accion: auditMetadata.accion,
          modulo: auditMetadata.modulo,
          tabla: auditMetadata.tabla,
          registroId,
          descripcion,
          usuarioId,
          usuarioEmail,
          usuarioNombre,
          usuarioIp,
          userAgent,
          datosAnteriores,
          datosNuevos,
          cambiosRealizados,
          metadatos: {
            endpoint: request.url,
            method: request.method,
            params: request.params,
          },
          duracionMs,
          exitoso: true,
        });

        // Para UPDATE, registrar cambios detallados
        if (
          auditMetadata.accion === TipoAccionEnum.UPDATE &&
          cambiosRealizados &&
          auditMetadata.tabla &&
          registroId
        ) {
          await this.auditService.registrarCambiosDetallados(
            auditMetadata.tabla,
            registroId,
            datosAnteriores,
            datosNuevos,
            usuarioId,
            usuarioEmail,
            usuarioNombre,
            usuarioIp,
          );
        }
      }),
      catchError((error) => {
        const duracionMs = Date.now() - startTime;

        // Registrar error en audit log
        this.auditService.logAudit({
          accion: auditMetadata.accion,
          modulo: auditMetadata.modulo,
          tabla: auditMetadata.tabla,
          descripcion: `Error al ${this.obtenerAccionTexto(auditMetadata.accion)} en ${auditMetadata.modulo}`,
          usuarioId,
          usuarioEmail,
          usuarioNombre,
          usuarioIp,
          userAgent,
          metadatos: datosRequest,
          duracionMs,
          exitoso: false,
          mensajeError: error.message || 'Error desconocido',
        });

        // Registrar en error log
        this.auditService.logError({
          mensaje: error.message || 'Error desconocido',
          tipo: error.constructor.name,
          codigo: error.code,
          severidad: error.status >= 500 ? 'HIGH' : 'MEDIUM',
          stackTrace: error.stack || '',
          contexto: `${context.getClass().name}.${context.getHandler().name}`,
          modulo: auditMetadata.modulo,
          metodoHttp: request.method,
          url: request.url,
          requestBody: request.body,
          usuarioId,
          usuarioEmail,
          ip: usuarioIp,
        });

        return throwError(() => error);
      }),
    );
  }

  private generarDescripcionAutomatica(
    accion: TipoAccionEnum,
    modulo: string,
    registroId?: string,
  ): string {
    const accionTexto = this.obtenerAccionTexto(accion);
    const idTexto = registroId ? ` (ID: ${registroId})` : '';
    return `${accionTexto} en ${modulo}${idTexto}`;
  }

  private obtenerAccionTexto(accion: TipoAccionEnum): string {
    const acciones: Record<TipoAccionEnum, string> = {
      [TipoAccionEnum.CREATE]: 'Crear registro',
      //   [TipoAccionEnum.VIEW]: 'Visualizar registro',
      [TipoAccionEnum.UPDATE]: 'Actualizar registro',
      [TipoAccionEnum.DELETE]: 'Eliminar registro',
      [TipoAccionEnum.LOGIN]: 'Iniciar sesión',
      [TipoAccionEnum.LOGOUT]: 'Cerrar sesión',
      [TipoAccionEnum.PASSWORD_CHANGE]: 'Cambio de contraseña',
      [TipoAccionEnum.EXPORT]: 'Exportar datos',
      [TipoAccionEnum.IMPORT]: 'Importar datos',
      [TipoAccionEnum.READ]: 'visualizar registro',
      [TipoAccionEnum.PRINT]: 'imprimir',
      [TipoAccionEnum.DOWNLOAD]: 'descargar',
      [TipoAccionEnum.APPROVE]: 'aprobar',
      [TipoAccionEnum.REJECT]: 'rechazar',
      [TipoAccionEnum.ACTIVATE]: 'activar',
      [TipoAccionEnum.DEACTIVATE]: 'desactivar',
      [TipoAccionEnum.RESTORE]: 'restaurar',
      [TipoAccionEnum.CUSTOM]: 'personalizar',
    };
    return acciones[accion] || 'Operación';
  }
}
