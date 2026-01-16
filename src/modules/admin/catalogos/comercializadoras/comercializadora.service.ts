import { Injectable } from '@nestjs/common';
import {
  CreateComercializadoraDto,
  UpdateComercializadoraDto,
} from './dto/comercializadora.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';

import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { ComercializadoraEntity, ComercializadoraDetail } from './comercializadora.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';
import {
  ComercializadoraWhereInput,
  ListComercializadoraArgsDto,
} from './dto/comercializadora.where.input';
import dayjs from 'dayjs';

@Injectable()
export class ComercializadoraService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateComercializadoraDto, session: IToken) {
    // Validar tipoComercializadora (1=techo o 2=monumental)
    if (inputDto.tipoComercializadora !== 1 && inputDto.tipoComercializadora !== 2) {
      return dataErrorValidations({
        tipoComercializadora: ['El tipo debe ser 1 (techo) o 2 (monumental)'],
      });
    }

    // Validar que la sucursal existe
    if (inputDto.sucursalId) {
      const sucursalExists = await this.prismaService.sucursal.findUnique({
        where: { id: inputDto.sucursalId },
        select: { id: true },
      });

      if (!sucursalExists) {
        return dataErrorValidations({ sucursalId: ['La sucursal no existe'] });
      }
    }

    // Validar que el cliente existe
    const clienteExists = await this.prismaService.cliente.findUnique({
      where: { id: inputDto.clienteId },
      select: { id: true },
    });

    if (!clienteExists) {
      return dataErrorValidations({ clienteId: ['El cliente no existe'] });
    }

    const metaData = (
      inputDto.metaData ? structuredClone(inputDto.metaData) : {}
    ) as Prisma.InputJsonValue;

    const result = await this.prismaService.comercializadora.create({
      data: {
        tipoComercializadora: inputDto.tipoComercializadora,
        metaData,
        sucursalId: inputDto.sucursalId,
        clienteId: inputDto.clienteId,
        minuta: inputDto.minuta,
        protocolo: inputDto.protocolo,
        fechaEnvio: inputDto.fechaEnvio ? dayjs(inputDto.fechaEnvio).toDate() : null,
        fechaEnvioTestimonio: inputDto.fechaEnvioTestimonio
          ? dayjs(inputDto.fechaEnvioTestimonio).toDate()
          : null,
        userCreateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<ComercializadoraEntity>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.comercializadora.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.comercializadora.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<ComercializadoraEntity[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListComercializadoraArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { where } = inputDto;

    const whereInput: Prisma.ComercializadoraWhereInput = {};

    // Aplicar filtros

    if (where?.tipoComercializadora) whereInput.tipoComercializadora = where.tipoComercializadora;
    if (where?.sucursalId) whereInput.sucursalId = where.sucursalId;
    if (where?.clienteId) whereInput.clienteId = where.clienteId;
    if (where?.consolidado) whereInput.consolidado = where.consolidado;
    if (where?.minuta) whereInput.minuta = where.minuta;
    if (where?.protocolo) whereInput.protocolo = where.protocolo;
    if (where?.fechaEnvio) whereInput.fechaEnvio = where.fechaEnvio;
    if (where?.fechaEnvioTestimonio) whereInput.fechaEnvioTestimonio = where.fechaEnvioTestimonio;
    if (where?.fechaCreacion) whereInput.fechaCreacion = where.fechaCreacion;

    // Aplicar filtros de metaData
    const metaDataConditions = this.buildMetaDataFilters(where);
    if (metaDataConditions.length > 0) {
      whereInput.AND = metaDataConditions;
    }

    const [list, total] = await Promise.all([
      this.prismaService.comercializadora.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
      }),
      this.prismaService.comercializadora.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<ComercializadoraEntity[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  private buildMetaDataFilters(
    where: ComercializadoraWhereInput,
  ): Prisma.ComercializadoraWhereInput[] {
    const metaDataConditions: Prisma.ComercializadoraWhereInput[] = [];
    if (where?.proyecto !== undefined) {
      metaDataConditions.push({ metaData: { path: ['proyecto'], equals: where.proyecto } });
    }
    if (where?.modulo !== undefined) {
      metaDataConditions.push({ metaData: { path: ['modulo'], equals: where.modulo } });
    }
    if (where?.bloque !== undefined) {
      metaDataConditions.push({ metaData: { path: ['bloque'], equals: where.bloque } });
    }
    if (where?.urbanizacion !== undefined) {
      metaDataConditions.push({ metaData: { path: ['urbanizacion'], equals: where.urbanizacion } });
    }
    if (where?.uv !== undefined) {
      metaDataConditions.push({ metaData: { path: ['uv'], equals: where.uv } });
    }
    if (where?.manzana !== undefined) {
      metaDataConditions.push({ metaData: { path: ['manzana'], equals: where.manzana } });
    }
    if (where?.lote !== undefined) {
      metaDataConditions.push({ metaData: { path: ['lote'], equals: where.lote } });
    }
    return metaDataConditions;
  }

  async findOne(id: number) {
    const item = await this.prismaService.comercializadora.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            tipoCliente: true,
            personaNatural: {
              select: {
                nombres: true,
                apellidos: true,
                numeroDocumento: true,
              },
            },
            personaJuridica: {
              select: {
                razonSocial: true,
                nit: true,
              },
            },
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
        servicios: {
          select: {
            id: true,
            codigoTicket: true,
            estadoActualId: true,
            tipoTramiteId: true,
          },
        },
      },
    });

    if (!item) {
      return dataResponseError('Comercializadora no encontrada');
    }

    return dataResponseSuccess({ data: item });
  }

  async update(id: number, updateDto: UpdateComercializadoraDto, session: IToken) {
    const exists = await this.prismaService.comercializadora.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return dataResponseError('Comercializadora no encontrada');
    }

    // Validar tipoComercializadora si se actualiza
    if (
      updateDto.tipoComercializadora !== undefined &&
      updateDto.tipoComercializadora !== 1 &&
      updateDto.tipoComercializadora !== 2
    ) {
      return dataErrorValidations({
        tipoComercializadora: ['El tipo debe ser 1 (techo) o 2 (monumental)'],
      });
    }

    // Validar sucursal si se actualiza
    if (updateDto.sucursalId) {
      const sucursalExists = await this.prismaService.sucursal.findUnique({
        where: { id: updateDto.sucursalId },
        select: { id: true },
      });

      if (!sucursalExists) {
        return dataErrorValidations({ sucursalId: ['La sucursal no existe'] });
      }
    }

    // Validar cliente si se actualiza
    if (updateDto.clienteId) {
      const clienteExists = await this.prismaService.cliente.findUnique({
        where: { id: updateDto.clienteId },
        select: { id: true },
      });

      if (!clienteExists) {
        return dataErrorValidations({ clienteId: ['El cliente no existe'] });
      }
    }

    const dataToUpdate: Prisma.ComercializadoraUpdateInput = {
      userUpdateId: session.usuarioId,
    };

    const metaData = (
      updateDto.metaData ? structuredClone(updateDto.metaData) : {}
    ) as Prisma.InputJsonValue;

    // if (updateDto.nombre !== undefined) dataToUpdate.nombre = updateDto.nombre;

    // Aplicar actualizaciones
    if (updateDto.tipoComercializadora !== undefined)
      dataToUpdate.tipoComercializadora = updateDto.tipoComercializadora;
    if (updateDto.metaData !== undefined) dataToUpdate.metaData = metaData;
    if (updateDto.sucursalId !== undefined)
      dataToUpdate.sucursal = {
        connect: { id: updateDto.sucursalId },
      };

    if (updateDto.clienteId !== undefined) {
      dataToUpdate.cliente = { connect: { id: updateDto.clienteId } };
    }
    if (updateDto.consolidado !== undefined) dataToUpdate.consolidado = updateDto.consolidado;
    if (updateDto.minuta !== undefined) dataToUpdate.minuta = updateDto.minuta;
    if (updateDto.protocolo !== undefined) dataToUpdate.protocolo = updateDto.protocolo;
    if (updateDto.fechaEnvio !== undefined) {
      dataToUpdate.fechaEnvio = updateDto.fechaEnvio ? dayjs(updateDto.fechaEnvio).toDate() : null;
    }
    if (updateDto.fechaEnvioTestimonio !== undefined) {
      dataToUpdate.fechaEnvioTestimonio = updateDto.fechaEnvioTestimonio
        ? dayjs(updateDto.fechaEnvioTestimonio).toDate()
        : null;
    }

    const result = await this.prismaService.comercializadora.update({
      where: { id },
      data: dataToUpdate,
    });

    return dataResponseSuccess<ComercializadoraEntity>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.comercializadora.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) return dataResponseError('Comercializadora no encontrada');

    const result = await this.prismaService.comercializadora.delete({ where: { id } });

    return dataResponseSuccess<ComercializadoraEntity>({ data: result });
  }
}
