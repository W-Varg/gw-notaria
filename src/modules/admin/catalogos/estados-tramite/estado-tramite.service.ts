import { Injectable } from '@nestjs/common';
import {
  CreateEstadoTramiteDto,
  UpdateEstadoTramiteDto,
  ListEstadoTramiteArgsDto,
} from './dto/estado-tramite.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';

import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { EstadoTramite } from './estado-tramite.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { IToken } from '../../../../common/decorators/token.decorator';

@Injectable()
export class EstadoTramiteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateEstadoTramiteDto, session: IToken) {
    const exists = await this.prismaService.estadoTramite.findFirst({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (exists) return dataErrorValidations({ nombre: ['Ya existe un estado con ese nombre'] });

    const result = await this.prismaService.estadoTramite.create({
      data: {
        ...inputDto,
        userCreateId: session.usuarioId,
      },
    });
    return dataResponseSuccess<EstadoTramite>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.estadoTramite.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.estadoTramite.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<EstadoTramite[]>({
      data: list,
      pagination,
    });
  }

  async getForSelect() {
    const list = await this.prismaService.estadoTramite.findMany({
      where: { estaActivo: true },
      select: {
        id: true,
        nombre: true,
        colorHex: true,
        orden: true,
      },
      orderBy: { orden: 'asc' },
    });

    return dataResponseSuccess({
      data: list,
    });
  }

  async filter(inputDto: ListEstadoTramiteArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, descripcion, colorHex, orden, estaActivo } = inputDto.where || {};
    const whereInput: Prisma.EstadoTramiteWhereInput = {};

    if (nombre) whereInput.nombre = nombre;
    if (descripcion) whereInput.descripcion = descripcion;
    if (colorHex) whereInput.colorHex = colorHex;
    if (orden !== undefined) whereInput.orden = orden;
    if (estaActivo !== undefined) whereInput.estaActivo = estaActivo;

    const [list, total] = await Promise.all([
      this.prismaService.estadoTramite.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
      }),
      this.prismaService.estadoTramite.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<EstadoTramite[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.estadoTramite.findUnique({
      where: { id },
    });
    if (!item) return dataResponseError('Estado de trámite no encontrado');
    return dataResponseSuccess<EstadoTramite>({ data: item });
  }

  async update(id: number, updateDto: UpdateEstadoTramiteDto, session: IToken) {
    const exists = await this.prismaService.estadoTramite.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Estado de trámite no encontrado');

    if (updateDto.nombre) {
      const duplicated = await this.prismaService.estadoTramite.findFirst({
        where: {
          nombre: updateDto.nombre,
          NOT: { id },
        },
        select: { id: true },
      });
      if (duplicated)
        return dataErrorValidations({ nombre: ['Ya existe un estado con ese nombre'] });
    }

    const result = await this.prismaService.estadoTramite.update({
      where: { id },
      data: {
        ...updateDto,
        userUpdateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<EstadoTramite>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.estadoTramite.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Estado de trámite no encontrado');

    await this.prismaService.estadoTramite.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Estado de trámite eliminado' });
  }
}
