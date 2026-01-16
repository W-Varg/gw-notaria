import { Injectable } from '@nestjs/common';
import {
  CreateResponsableServicioDto,
  UpdateResponsableServicioDto,
  ListResponsableServicioArgsDto,
} from './dto/responsable-servicio.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';

import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { ResponsableServicio } from './responsable-servicio.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';

@Injectable()
export class ResponsableServicioService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateResponsableServicioDto) {
    // Validar que el usuario existe
    const usuarioExists = await this.prismaService.usuario.findUnique({
      where: { id: inputDto.usuarioId },
      select: { id: true },
    });
    if (!usuarioExists) return dataErrorValidations({ usuarioId: ['El usuario no existe'] });

    // Validar que el servicio existe
    const servicioExists = await this.prismaService.servicio.findUnique({
      where: { id: inputDto.servicioId },
      select: { id: true },
    });
    if (!servicioExists) return dataErrorValidations({ servicioId: ['El servicio no existe'] });

    // Verificar si ya existe una asignación activa
    const existingActive = await this.prismaService.responsableServicio.findFirst({
      where: {
        usuarioId: inputDto.usuarioId,
        servicioId: inputDto.servicioId,
        activo: true,
      },
      select: { id: true },
    });
    if (existingActive)
      return dataErrorValidations({
        usuarioId: ['El usuario ya está asignado activamente a este servicio'],
        servicioId: ['El usuario ya está asignado activamente a este servicio'],
      });

    const result = await this.prismaService.responsableServicio.create({
      data: inputDto,
      include: {
        usuario: true,
        servicio: true,
      },
    });

    return dataResponseSuccess<ResponsableServicio>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.responsableServicio.findMany({
        skip,
        take,
        orderBy,
        include: {
          usuario: true,
          servicio: true,
        },
      }),
      pagination ? this.prismaService.responsableServicio.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<ResponsableServicio[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListResponsableServicioArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { usuarioId, servicioId, activo } = inputDto.where || {};
    const whereInput: Prisma.ResponsableServicioWhereInput = {};

    if (usuarioId) whereInput.usuarioId = usuarioId;
    if (servicioId) whereInput.servicioId = servicioId;
    if (activo !== undefined) whereInput.activo = activo;

    const [list, total] = await Promise.all([
      this.prismaService.responsableServicio.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          usuario: true,
          servicio: true,
        },
      }),
      this.prismaService.responsableServicio.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<ResponsableServicio[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.responsableServicio.findUnique({
      where: { id },
      include: {
        usuario: true,
        servicio: true,
      },
    });
    if (!item) return dataResponseError('Responsable de servicio no encontrado');
    return dataResponseSuccess<ResponsableServicio>({ data: item });
  }

  async update(id: number, updateDto: UpdateResponsableServicioDto) {
    const exists = await this.prismaService.responsableServicio.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Responsable de servicio no encontrado');

    // Validar usuario si se actualiza
    if (updateDto.usuarioId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: updateDto.usuarioId },
        select: { id: true },
      });
      if (!usuarioExists) return dataResponseError('El usuario no existe');
    }

    // Validar servicio si se actualiza
    if (updateDto.servicioId) {
      const servicioExists = await this.prismaService.servicio.findUnique({
        where: { id: updateDto.servicioId },
        select: { id: true },
      });
      if (!servicioExists) return dataResponseError('El servicio no existe');
    }

    const result = await this.prismaService.responsableServicio.update({
      where: { id },
      data: updateDto,
      include: {
        usuario: true,
        servicio: true,
      },
    });

    return dataResponseSuccess<ResponsableServicio>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.responsableServicio.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Responsable de servicio no encontrado');

    await this.prismaService.responsableServicio.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Responsable de servicio eliminado' });
  }
}
