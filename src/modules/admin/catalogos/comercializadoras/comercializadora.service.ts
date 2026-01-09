import { Injectable } from '@nestjs/common';
import {
  CreateComercializadoraDto,
  UpdateComercializadoraDto,
  ListComercializadoraArgsDto,
} from './dto/comercializadora.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Comercializadora } from './comercializadora.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class ComercializadoraService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateComercializadoraDto, session: IToken) {
    // Validar que el cliente existe
    const clienteExists = await this.prismaService.cliente.findUnique({
      where: { id: inputDto.clienteId },
      select: { id: true },
    });

    if (!clienteExists) {
      return dataErrorValidations({ clienteId: ['El cliente no existe'] });
    }

    // Validar tipo (1 o 2)
    if (inputDto.tipo !== 1 && inputDto.tipo !== 2) {
      return dataErrorValidations({ tipo: ['El tipo debe ser 1 (techo) o 2 (monumental)'] });
    }

    const result = await this.prismaService.comercializadora.create({
      data: {
        nombre: inputDto.nombre,
        tipo: inputDto.tipo,
        metaData: inputDto.metaData,
        departamento: inputDto.departamento,
        clienteId: inputDto.clienteId,
        consolidado: inputDto.consolidado ?? false,
        minuta: inputDto.minuta,
        protocolo: inputDto.protocolo,
        fechaEnvio: inputDto.fechaEnvio ? new Date(inputDto.fechaEnvio) : null,
        fechaEnvioTestimonio: inputDto.fechaEnvioTestimonio
          ? new Date(inputDto.fechaEnvioTestimonio)
          : null,
        userCreateId: session.usuarioId,
      },
      include: {
        cliente: {
          include: {
            personaNatural: true,
            personaJuridica: true,
          },
        },
      },
    });

    return dataResponseSuccess<Comercializadora>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.comercializadora.findMany({
        skip,
        take,
        orderBy,
        include: {
          cliente: {
            include: {
              personaNatural: true,
              personaJuridica: true,
            },
          },
        },
      }),
      pagination ? this.prismaService.comercializadora.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Comercializadora[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListComercializadoraArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, tipo, departamento, clienteId, consolidado } = inputDto.where || {};
    const whereInput: Prisma.ComercializadoraWhereInput = {};

    if (nombre) whereInput.nombre = { contains: nombre, mode: 'insensitive' };
    if (tipo !== undefined) whereInput.tipo = tipo;
    if (departamento) whereInput.departamento = { contains: departamento, mode: 'insensitive' };
    if (clienteId) whereInput.clienteId = clienteId;
    if (consolidado !== undefined) whereInput.consolidado = consolidado;

    const [list, total] = await Promise.all([
      this.prismaService.comercializadora.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          cliente: {
            include: {
              personaNatural: true,
              personaJuridica: true,
            },
          },
        },
      }),
      this.prismaService.comercializadora.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<Comercializadora[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.comercializadora.findUnique({
      where: { id },
      include: {
        cliente: {
          include: {
            personaNatural: true,
            personaJuridica: true,
          },
        },
        servicios: {
          include: {
            tipoDocumento: true,
            tipoTramite: true,
            estadoActual: true,
          },
        },
      },
    });

    if (!item) return dataResponseError('Comercializadora no encontrada');

    return dataResponseSuccess<Comercializadora>({ data: item });
  }

  async update(id: number, updateDto: UpdateComercializadoraDto, session: IToken) {
    const exists = await this.prismaService.comercializadora.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) return dataResponseError('Comercializadora no encontrada');

    // Validar cliente si se actualiza
    if (updateDto.clienteId) {
      const clienteExists = await this.prismaService.cliente.findUnique({
        where: { id: updateDto.clienteId },
        select: { id: true },
      });
      if (!clienteExists) return dataResponseError('El cliente no existe');
    }

    // Validar tipo si se actualiza
    if (updateDto.tipo !== undefined && updateDto.tipo !== 1 && updateDto.tipo !== 2) {
      return dataErrorValidations({ tipo: ['El tipo debe ser 1 (techo) o 2 (monumental)'] });
    }

    const dataToUpdate: any = {
      ...updateDto,
      userUpdateId: session.usuarioId,
    };

    // Convertir fechas si están presentes
    if (updateDto.fechaEnvio) {
      dataToUpdate.fechaEnvio = new Date(updateDto.fechaEnvio);
    }
    if (updateDto.fechaEnvioTestimonio) {
      dataToUpdate.fechaEnvioTestimonio = new Date(updateDto.fechaEnvioTestimonio);
    }

    const result = await this.prismaService.comercializadora.update({
      where: { id },
      data: dataToUpdate,
      include: {
        cliente: {
          include: {
            personaNatural: true,
            personaJuridica: true,
          },
        },
      },
    });

    return dataResponseSuccess<Comercializadora>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.comercializadora.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) return dataResponseError('Comercializadora no encontrada');

    await this.prismaService.comercializadora.delete({ where: { id } });

    return dataResponseSuccess({ data: 'Comercializadora eliminada' });
  }
}
