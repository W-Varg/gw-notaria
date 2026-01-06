import { Injectable } from '@nestjs/common';
import {
  CreateTipoTramiteDto,
  UpdateTipoTramiteDto,
  ListTipoTramiteArgsDto,
} from './dto/tipo-tramite.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { TipoTramiteEntity, TipoTramiteDetail } from './tipo-tramite.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class TipoTramiteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateTipoTramiteDto, session: IToken) {
    // Verificar que el tipo de documento existe si se proporciona
    if (inputDto.tipoDocumentoId) {
      const tipoDocumento = await this.prismaService.tipoDocumento.findUnique({
        where: { id: inputDto.tipoDocumentoId },
        select: { id: true },
      });
      if (!tipoDocumento) {
        return dataErrorValidations({ tipoDocumentoId: ['El tipo de documento no existe'] });
      }
    }

    const exists = await this.prismaService.tipoTramite.findUnique({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (exists) return dataErrorValidations({ nombre: ['El tipo de trámite ya existe'] });

    const result = await this.prismaService.tipoTramite.create({
      data: {
        ...inputDto,
        userCreateId: session.usuarioId,
      },
    });
    return dataResponseSuccess<TipoTramiteEntity>({ data: result });
  }

  async select() {
    const list = await this.prismaService.tipoTramite.findMany({
      where: { estaActiva: true },
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        colorHex: true,
        icon: true,
        descripcion: true,
        imagen: true,
        costoBase: true,
        estaActiva: true,
        tipoDocumento: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    return dataResponseSuccess<any[]>({ data: list });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.tipoTramite.findMany({
        skip,
        take,
        orderBy,
        include: {
          tipoDocumento: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      }),
      pagination ? this.prismaService.tipoTramite.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<TipoTramiteEntity[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListTipoTramiteArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, estaActiva, descripcion, tipoDocumentoId, claseTramite, negocio } =
      inputDto.where || {};
    const whereInput: Prisma.TipoTramiteWhereInput = {};

    if (nombre) whereInput.nombre = nombre;
    if (descripcion) whereInput.descripcion = descripcion;
    if (tipoDocumentoId) whereInput.tipoDocumentoId = tipoDocumentoId;
    if (claseTramite) whereInput.claseTramite = claseTramite;
    if (negocio) whereInput.negocio = negocio;
    if (estaActiva !== undefined) whereInput.estaActiva = estaActiva;

    const [list, total] = await Promise.all([
      this.prismaService.tipoTramite.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          tipoDocumento: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      }),
      this.prismaService.tipoTramite.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<TipoTramiteEntity[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const item = await this.prismaService.tipoTramite.findUnique({
      where: { id },
      include: {
        tipoDocumento: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
        },
      },
    });
    if (!item) return dataResponseError('Tipo de trámite no encontrado');
    return dataResponseSuccess<TipoTramiteEntity>({ data: item });
  }

  async update(id: string, updateTipoTramiteDto: UpdateTipoTramiteDto, session: IToken) {
    const exists = await this.prismaService.tipoTramite.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Tipo de trámite no encontrado');

    // Verificar que el tipo de documento existe si se está actualizando
    if (updateTipoTramiteDto.tipoDocumentoId) {
      const tipoDocumento = await this.prismaService.tipoDocumento.findUnique({
        where: { id: updateTipoTramiteDto.tipoDocumentoId },
        select: { id: true },
      });
      if (!tipoDocumento) {
        return dataErrorValidations({ tipoDocumentoId: ['El tipo de documento no existe'] });
      }
    }

    if (updateTipoTramiteDto.nombre) {
      const nameExists = await this.prismaService.tipoTramite.findFirst({
        where: { nombre: updateTipoTramiteDto.nombre, id: { not: id } },
        select: { id: true },
      });
      if (nameExists) {
        return dataErrorValidations({ nombre: ['Ya existe un tipo de trámite con ese nombre'] });
      }
    }

    const result = await this.prismaService.tipoTramite.update({
      where: { id },
      data: {
        ...updateTipoTramiteDto,
        userUpdateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<TipoTramiteEntity>({ data: result });
  }

  async remove(id: string) {
    const exists = await this.prismaService.tipoTramite.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Tipo de trámite no encontrado');

    // Verificar si tiene servicios asociados
    const hasServicios = await this.prismaService.servicio.count({
      where: { tipoTramiteId: id },
    });

    if (hasServicios > 0) {
      return dataResponseError('El tipo de trámite tiene servicios asociados');
    }

    await this.prismaService.tipoTramite.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Tipo de trámite eliminado' });
  }
}
