import { Injectable } from '@nestjs/common';
import {
  CreateHistorialEstadosServicioDto,
  UpdateHistorialEstadosServicioDto,
  ListHistorialEstadosServicioArgsDto,
} from './dto/historial-estados-servicio.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';

import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { HistorialEstadosServicio } from './historial-estados-servicio.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@Injectable()
export class HistorialEstadosServicioService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateHistorialEstadosServicioDto) {
    // Validar que el servicio existe
    const servicioExists = await this.prismaService.servicio.findUnique({
      where: { id: inputDto.servicioId },
      select: { id: true },
    });
    if (!servicioExists) return dataErrorValidations({ servicioId: ['El servicio no existe'] });

    // Validar que el estado existe
    const estadoExists = await this.prismaService.estadoTramite.findUnique({
      where: { id: inputDto.estadoId },
      select: { id: true },
    });
    if (!estadoExists) return dataErrorValidations({ estadoId: ['El estado no existe'] });

    // Validar usuario si se proporciona
    if (inputDto.usuarioId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: inputDto.usuarioId },
        select: { id: true },
      });
      if (!usuarioExists) return dataErrorValidations({ usuarioId: ['El usuario no existe'] });
    }

    const result = await this.prismaService.historialEstadosServicio.create({
      data: inputDto,
      include: {
        servicio: true,
        estado: true,
        usuario: true,
      },
    });

    return dataResponseSuccess<HistorialEstadosServicio>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.historialEstadosServicio.findMany({
        skip,
        take,
        orderBy,
        include: {
          servicio: true,
          estado: true,
          usuario: true,
        },
      }),
      pagination ? this.prismaService.historialEstadosServicio.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<HistorialEstadosServicio[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListHistorialEstadosServicioArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { usuarioId, servicioId, estadoId } = inputDto.where || {};
    const whereInput: Prisma.HistorialEstadosServicioWhereInput = {};

    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (servicioId) whereInput.servicioId = servicioId;
    if (estadoId) whereInput.estadoId = estadoId;

    const [list, total] = await Promise.all([
      this.prismaService.historialEstadosServicio.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          servicio: true,
          estado: true,
          usuario: true,
        },
      }),
      this.prismaService.historialEstadosServicio.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<HistorialEstadosServicio[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.historialEstadosServicio.findUnique({
      where: { id },
      include: {
        servicio: true,
        estado: true,
        usuario: true,
      },
    });
    if (!item) return dataResponseError('Historial de estado no encontrado');
    return dataResponseSuccess<HistorialEstadosServicio>({ data: item });
  }

  async update(id: number, updateDto: UpdateHistorialEstadosServicioDto) {
    const exists = await this.prismaService.historialEstadosServicio.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Historial de estado no encontrado');

    // Validar servicio si se actualiza
    if (updateDto.servicioId) {
      const servicioExists = await this.prismaService.servicio.findUnique({
        where: { id: updateDto.servicioId },
        select: { id: true },
      });
      if (!servicioExists) return dataResponseError('El servicio no existe');
    }

    // Validar estado si se actualiza
    if (updateDto.estadoId) {
      const estadoExists = await this.prismaService.estadoTramite.findUnique({
        where: { id: updateDto.estadoId },
        select: { id: true },
      });
      if (!estadoExists) return dataResponseError('El estado no existe');
    }

    const result = await this.prismaService.historialEstadosServicio.update({
      where: { id },
      data: updateDto,
      include: {
        servicio: true,
        estado: true,
        usuario: true,
      },
    });

    return dataResponseSuccess<HistorialEstadosServicio>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.historialEstadosServicio.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Historial de estado no encontrado');

    await this.prismaService.historialEstadosServicio.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Historial de estado eliminado' });
  }
}
