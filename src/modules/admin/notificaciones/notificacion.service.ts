import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../global/database/prisma.service';
import {
  CreateNotificacionDto,
  UpdateNotificacionDto,
  ListNotificacionArgsDto,
} from './dto/notificacion.input.dto';
import { paginationParamsFormat } from '../../../helpers/prisma.helper';
import { IToken } from '../../../common/decorators/token.decorator';
import { dataResponseError, dataResponseSuccess } from '../../../common/dtos';
import { Notificacion } from './notificacion.entity';
import { ListFindAllQueryDto } from '../../../common/dtos/filters.dto';

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

    return dataResponseSuccess<Notificacion>({ data: notificacion });
  }

  // ==================== FIND ALL (SIMPLE) ====================
  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prisma.notificacion.findMany({
        skip,
        take,
        orderBy: orderBy || { fechaCreacion: 'desc' },
      }),
      pagination ? this.prisma.notificacion.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Notificacion[]>({
      data: list,
      pagination,
    });
  }

  // ==================== FIND ALL (PAGINATED WITH FILTERS) ====================
  async filter(listArgs: ListNotificacionArgsDto) {
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

    const [list, total] = await Promise.all([
      this.prisma.notificacion.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaCreacion: 'desc' },
      }),
      this.prisma.notificacion.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<Notificacion[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  // ==================== FIND ONE ====================
  async findOne(id: string) {
    const item = await this.prisma.notificacion.findUnique({
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

    if (!item) return dataResponseError('registro no encontrado');
    return dataResponseSuccess<Notificacion>({ data: item });
  }

  // ==================== UPDATE ====================
  async update(id: string, updateDto: UpdateNotificacionDto, session: IToken) {
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

    return dataResponseSuccess<Notificacion>({ data: notificacion });
  }

  // ==================== REMOVE ====================
  async remove(id: string) {
    const result = await this.prisma.notificacion.delete({
      where: { id },
    });

    return dataResponseSuccess<Notificacion>({ data: result });
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

    return dataResponseSuccess<Notificacion[]>({ data: notificaciones });
  }

  // Contar notificaciones no leídas
  async countUnreadByUser(usuarioId: string) {
    const count = await this.prisma.notificacion.count({
      where: { usuarioId, leida: false },
    });

    return { count };
  }

  // Marcar como leída
  async markAsRead(id: string) {
    const result = await this.prisma.notificacion.update({
      where: { id },
      data: { leida: true },
    });

    return dataResponseSuccess<Notificacion>(
      { data: result },
      { message: 'notificacion marcada como leida' },
    );
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

    return dataResponseSuccess(
      { data: { count: result.count } },
      { message: `${result.count} notificaciones marcadas como leídas` },
    );
  }

  // Limpiar notificaciones leídas
  async clearReadByUser(usuarioId: string) {
    const result = await this.prisma.notificacion.deleteMany({
      where: {
        usuarioId,
        leida: true,
      },
    });

    return dataResponseSuccess(
      { data: { count: result.count } },
      { message: `${result.count} notificaciones eliminadas` },
    );
  }
}
