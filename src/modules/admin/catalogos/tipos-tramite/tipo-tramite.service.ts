import { Injectable } from '@nestjs/common';
import {
  CreateTipoTramiteDto,
  UpdateTipoTramiteDto,
  ListTipoTramiteArgsDto,
} from './dto/tipo-tramite.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { TipoTramiteEntity, TipoTramiteDetail } from './tipo-tramite.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { IToken } from '../../../../common/decorators/token.decorator';

@Injectable()
export class TipoTramiteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateTipoTramiteDto, session: IToken) {
    // Verificar que la sucursal existe
    const sucursal = await this.prismaService.sucursal.findUnique({
      where: { id: inputDto.sucursalId },
      select: { id: true },
    });
    if (!sucursal) {
      return dataErrorValidations({ sucursalId: ['La sucursal no existe'] });
    }

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

    // Verificar unicidad compuesta de sucursalId + nombre
    const exists = await this.prismaService.tipoTramite.findUnique({
      where: {
        sucursalId_nombre: {
          sucursalId: inputDto.sucursalId,
          nombre: inputDto.nombre,
        },
      },
      select: { id: true },
    });
    if (exists)
      return dataErrorValidations({
        nombre: ['Ya existe un tipo de trámite con ese nombre en esta sucursal'],
      });

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
        sucursalId: true,
        tipoDocumento: {
          select: {
            id: true,
            nombre: true,
          },
        },
        sucursal: {
          select: {
            id: true,
            nombre: true,
            abreviacion: true,
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
          sucursal: {
            select: {
              id: true,
              nombre: true,
              abreviacion: true,
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
    const { sucursalId, nombre, estaActiva, descripcion, tipoDocumentoId, claseTramite, negocio } =
      inputDto.where || {};
    const whereInput: Prisma.TipoTramiteWhereInput = {};

    if (sucursalId) whereInput.sucursalId = sucursalId;
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
          sucursal: {
            select: {
              id: true,
              nombre: true,
              abreviacion: true,
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
        sucursal: {
          select: {
            id: true,
            nombre: true,
            abreviacion: true,
            departamento: true,
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
      select: { id: true, sucursalId: true },
    });
    if (!exists) return dataResponseError('Tipo de trámite no encontrado');

    // Verificar que la sucursal existe si se está actualizando
    if (updateTipoTramiteDto.sucursalId) {
      const sucursal = await this.prismaService.sucursal.findUnique({
        where: { id: updateTipoTramiteDto.sucursalId },
        select: { id: true },
      });
      if (!sucursal) {
        return dataErrorValidations({ sucursalId: ['La sucursal no existe'] });
      }
    }

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

    // Validar unicidad compuesta de sucursalId + nombre si se actualiza alguno de estos campos
    if (updateTipoTramiteDto.nombre || updateTipoTramiteDto.sucursalId) {
      const sucursalIdToCheck = updateTipoTramiteDto.sucursalId ?? exists.sucursalId;
      const nombreToCheck = updateTipoTramiteDto.nombre;

      if (nombreToCheck) {
        const nameExists = await this.prismaService.tipoTramite.findFirst({
          where: {
            sucursalId: sucursalIdToCheck,
            nombre: nombreToCheck,
            id: { not: id },
          },
          select: { id: true },
        });
        if (nameExists) {
          return dataErrorValidations({
            nombre: ['Ya existe un tipo de trámite con ese nombre en esta sucursal'],
          });
        }
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
