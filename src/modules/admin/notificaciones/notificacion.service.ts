import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  CreateNotificacionDto,
  UpdateNotificacionDto,
  ListNotificacionArgsDto,
} from './dto/notificacion.input.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class NotificacionService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== CREATE ====================
  async create(createDto: CreateNotificacionDto, session: IToken) {
    const notificacion = await this.prisma.notificacion.create({
      data: {
        usuarioId: createDto.usuarioId,
        titulo: createDto.titulo,
        mensaje: createDto.mensaje,
        tipo: createDto.tipo || 'info',
        leida: createDto.leida || false,
        icono: createDto.icono,
        ruta: createDto.ruta,
        userCreateId: session.usuarioId,
      },
    });

    return notificacion;
  }

  // ==================== FIND ALL (PAGINATED) ====================
  async findAll(listArgs: ListNotificacionArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(listArgs, true);
    const { usuarioId, titulo, mensaje, tipo, leida, icono, ruta, fechaCreacion } =
      listArgs.where || {};

    const whereInput: Prisma.NotificacionWhereInput = {};
    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (titulo) whereInput.titulo = titulo;
    if (mensaje) whereInput.mensaje = mensaje;
    if (tipo) whereInput.tipo = tipo;
    if (leida !== undefined) whereInput.leida = leida;
    if (icono) whereInput.icono = icono;
    if (ruta) whereInput.ruta = ruta;
    if (fechaCreacion) whereInput.fechaCreacion = fechaCreacion;

    const [notificaciones, total] = await Promise.all([
      this.prisma.notificacion.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaCreacion: 'desc' },
      }),
      this.prisma.notificacion.count({
        where: whereInput,
      }),
    ]);

    return {
      count: total,
      results: notificaciones,
    };
  }

  // ==================== FIND ONE ====================
  async findOne(id: string) {
    const notificacion = await this.prisma.notificacion.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
          },
        },
      },
    });

    if (!notificacion) {
      throw new NotFoundException(`Notificación con ID "${id}" no encontrada`);
    }

    return notificacion;
  }

  // ==================== UPDATE ====================
  async update(id: string, updateDto: UpdateNotificacionDto, session: IToken) {
    await this.findOne(id); // Verifica existencia

    const notificacion = await this.prisma.notificacion.update({
      where: { id },
      data: {
        titulo: updateDto.titulo,
        mensaje: updateDto.mensaje,
        tipo: updateDto.tipo,
        leida: updateDto.leida,
        icono: updateDto.icono,
        ruta: updateDto.ruta,
        userUpdateId: session.usuarioId,
      },
    });

    return notificacion;
  }

  // ==================== REMOVE ====================
  async remove(id: string) {
    await this.findOne(id); // Verifica existencia

    await this.prisma.notificacion.delete({
      where: { id },
    });

    return { message: 'Notificación eliminada correctamente' };
  }

  // ==================== CUSTOM METHODS ====================

  // Obtener notificaciones no leídas de un usuario
  async findUnreadByUser(usuarioId: string) {
    const notificaciones = await this.prisma.notificacion.findMany({
      where: {
        usuarioId,
        leida: false,
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });

    return notificaciones;
  }

  // Contar notificaciones no leídas
  async countUnreadByUser(usuarioId: string) {
    const count = await this.prisma.notificacion.count({
      where: {
        usuarioId,
        leida: false,
      },
    });

    return { count };
  }

  // Marcar como leída
  async markAsRead(id: string) {
    const notificacion = await this.findOne(id);

    await this.prisma.notificacion.update({
      where: { id },
      data: { leida: true },
    });

    return { message: 'Notificación marcada como leída' };
  }

  // Marcar todas como leídas
  async markAllAsReadByUser(usuarioId: string) {
    const result = await this.prisma.notificacion.updateMany({
      where: {
        usuarioId,
        leida: false,
      },
      data: {
        leida: true,
      },
    });

    return {
      message: `${result.count} notificaciones marcadas como leídas`,
      count: result.count,
    };
  }

  // Limpiar notificaciones leídas
  async clearReadByUser(usuarioId: string) {
    const result = await this.prisma.notificacion.deleteMany({
      where: {
        usuarioId,
        leida: true,
      },
    });

    return {
      message: `${result.count} notificaciones eliminadas`,
      count: result.count,
    };
  }
}
