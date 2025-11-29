import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { NotificationService } from 'src/modules/admin/notification-system/services/notification.service';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';

import {
  CategoriaMensaje,
  CreateMensajeContactoDto,
  EstadoMensaje,
  ListContactoArgsDto,
  MarcarComoLeidoDto,
  MensajeContactoWhereInput,
  ResponderMensajeDto,
  UpdateMensajeContactoDto,
} from './dto/contacto.dto';

@Injectable()
export class ContactoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  private getUserIdFromReq(req: any): string {
    return req.userHeader?.usuarioId?.toString() || null;
  }

  async create(req: any, input: CreateMensajeContactoDto) {
    const userId = this.getUserIdFromReq(req);

    const mensaje = await this.prisma.mensajeContacto.create({
      data: {
        usuarioId: userId,
        nombre: input.nombre,
        correo: input.correo,
        telefono: input.telefono,
        asunto: input.asunto,
        mensaje: input.mensaje,
        estado: EstadoMensaje.NO_LEIDO,
      },
    });

    // Enviar notificación de mensaje de contacto creado
    if (userId) {
      // Si es un usuario autenticado, obtener sus datos
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: userId },
        select: { email: true, nombre: true, apellidos: true },
      });

      if (usuario) {
        await this.notificationService.notifyMensajeContactoCreated(
          mensaje.id,
          userId,
          usuario.email,
          `${usuario.nombre} ${usuario.apellidos}`,
          input.asunto,
        );
      }
    } else {
      // Si es un usuario anónimo, usar los datos del formulario
      await this.notificationService.notifyMensajeContactoCreated(
        mensaje.id,
        'anonymous',
        input.correo,
        input.nombre,
        input.asunto,
      );
    }

    return dataResponseSuccess({ data: mensaje });
  }

  async findAll() {
    const mensajes = await this.prisma.mensajeContacto.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true, email: true } },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    return dataResponseSuccess({ data: mensajes });
  }

  async filter(inputDto: ListContactoArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { usuarioId, nombre, correo, categoria, estado, asunto } = inputDto.where || {};
    const whereInput: Prisma.MensajeContactoWhereInput = {};

    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (nombre) whereInput.nombre = { contains: nombre };
    if (correo) whereInput.correo = { contains: correo };
    if (categoria) whereInput.categoria = categoria as any;
    if (estado) whereInput.estado = estado;
    if (asunto) whereInput.asunto = { contains: asunto };

    const [list, total] = await Promise.all([
      this.prisma.mensajeContacto.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          usuario: { select: { id: true, nombre: true, apellidos: true, email: true } },
        },
      }),
      this.prisma.mensajeContacto.count({ where: whereInput }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const mensaje = await this.prisma.mensajeContacto.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true, email: true } },
      },
    });

    if (!mensaje) return dataResponseError('Mensaje no encontrado');
    return dataResponseSuccess({ data: mensaje });
  }

  async update(id: string, input: UpdateMensajeContactoDto) {
    const exists = await this.prisma.mensajeContacto.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Mensaje no encontrado');

    const updated = await this.prisma.mensajeContacto.update({
      where: { id },
      data: input as any,
    });

    return dataResponseSuccess({ data: updated });
  }

  async remove(id: string) {
    const exists = await this.prisma.mensajeContacto.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Mensaje no encontrado');

    await this.prisma.mensajeContacto.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Mensaje eliminado' });
  }

  async responderMensaje(id: string, input: ResponderMensajeDto) {
    const mensaje = await this.prisma.mensajeContacto.findUnique({
      where: { id },
      select: { id: true, estado: true, correo: true, asunto: true },
    });

    if (!mensaje) return dataResponseError('Mensaje no encontrado');

    // Aquí se implementaría el envío del email de respuesta
    // Por ahora solo actualizamos el estado
    const updated = await this.prisma.mensajeContacto.update({
      where: { id },
      data: { estado: EstadoMensaje.RESPONDIDO },
    });

    // TODO: Implementar envío de email
    // await this.emailService.enviarRespuesta({
    //   to: mensaje.correo,
    //   subject: input.asuntoRespuesta || `Re: ${mensaje.asunto}`,
    //   body: input.respuesta,
    // });

    return dataResponseSuccess({
      data: {
        id: updated.id,
        estado: updated.estado,
        fechaActualizacion: updated.fechaActualizacion,
        message: 'Respuesta enviada exitosamente',
      },
    });
  }

  async marcarComoLeido(input: MarcarComoLeidoDto) {
    const updated = await this.prisma.mensajeContacto.updateMany({
      where: { id: { in: input.mensajeIds } },
      data: { estado: EstadoMensaje.LEIDO },
    });

    return dataResponseSuccess({
      data: {
        mensajesActualizados: updated.count,
        message: `${updated.count} mensajes marcados como leídos`,
      },
    });
  }

  async getMensajesNoLeidos() {
    const mensajes = await this.prisma.mensajeContacto.findMany({
      where: { estado: EstadoMensaje.NO_LEIDO },
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true, email: true } },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    return dataResponseSuccess({ data: mensajes });
  }

  async getMensajesPorEstado(estado: EstadoMensaje) {
    const mensajes = await this.prisma.mensajeContacto.findMany({
      where: { estado },
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true, email: true } },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    return dataResponseSuccess({ data: mensajes });
  }

  async getEstadisticas() {
    const [
      totalMensajes,
      mensajesNoLeidos,
      mensajesEnProceso,
      mensajesRespondidos,
      mensajesCerrados,
      distribucionPorCategoria,
      mensajesUltimos7Dias,
    ] = await Promise.all([
      this.prisma.mensajeContacto.count(),
      this.prisma.mensajeContacto.count({ where: { estado: EstadoMensaje.NO_LEIDO } }),
      this.prisma.mensajeContacto.count({ where: { estado: EstadoMensaje.EN_PROCESO } }),
      this.prisma.mensajeContacto.count({ where: { estado: EstadoMensaje.RESPONDIDO } }),
      this.prisma.mensajeContacto.count({ where: { estado: EstadoMensaje.CERRADO } }),
      this.prisma
        .$queryRaw`SELECT categoria, COUNT(*) as count FROM int_mensajes_contacto GROUP BY categoria`,
      this.prisma.mensajeContacto.count({
        where: {
          fechaCreacion: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calcular tiempo promedio de respuesta (simplificado)
    const mensajesRespondidosConFecha = await this.prisma.mensajeContacto.findMany({
      where: { estado: EstadoMensaje.RESPONDIDO },
      select: { fechaCreacion: true, fechaActualizacion: true },
    });

    const tiempoPromedioRespuesta =
      mensajesRespondidosConFecha.length > 0
        ? mensajesRespondidosConFecha.reduce((acc, mensaje) => {
            const tiempoRespuesta =
              mensaje.fechaActualizacion.getTime() - mensaje.fechaCreacion.getTime();
            return acc + tiempoRespuesta;
          }, 0) /
          mensajesRespondidosConFecha.length /
          (1000 * 60 * 60) // convertir a horas
        : 0;

    const distribucionCategoria = Object.values(CategoriaMensaje).reduce(
      (acc, categoria) => {
        const count =
          (distribucionPorCategoria as any[]).find((d) => d.categoria === categoria)?.count || 0;
        acc[categoria] = count;
        return acc;
      },
      {} as Record<CategoriaMensaje, number>,
    );

    return dataResponseSuccess({
      data: {
        totalMensajes,
        mensajesNoLeidos,
        mensajesEnProceso,
        mensajesRespondidos,
        mensajesCerrados,
        distribucionPorCategoria: distribucionCategoria,
        mensajesUltimos7Dias,
        tiempoPromedioRespuesta: Math.round(tiempoPromedioRespuesta * 100) / 100,
      },
    });
  }

  async getMensajesPorCategoria(categoria: CategoriaMensaje) {
    const mensajes = await this.prisma.mensajeContacto.findMany({
      where: { categoria: categoria as any },
      include: {
        usuario: { select: { id: true, nombre: true, apellidos: true, email: true } },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    return dataResponseSuccess({ data: mensajes });
  }
}
