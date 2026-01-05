import { Injectable } from '@nestjs/common';
import {
  CreateServicioDto,
  UpdateServicioDto,
  ListServicioArgsDto,
} from './dto/servicio.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Servicio } from './servicio.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class ServicioService {
  constructor(private readonly prismaService: PrismaService) {}

  private generateCodigoTicket(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TKT-${timestamp}-${random}`;
  }

  async create(inputDto: CreateServicioDto, session: IToken) {
    // Validar que el cliente existe
    const clienteExists = await this.prismaService.cliente.findUnique({
      where: { id: inputDto.clienteId },
      select: { id: true },
    });
    if (!clienteExists) return dataErrorValidations({ clienteId: ['El cliente no existe'] });

    // Validar que el tipo de documento existe
    const tipoDocExists = await this.prismaService.tipoDocumento.findUnique({
      where: { id: inputDto.tipoDocumentoId },
      select: { id: true, precioBase: true },
    });
    if (!tipoDocExists)
      return dataErrorValidations({ tipoDocumentoId: ['El tipo de documento no existe'] });

    // Validar que el tipo de trámite existe (si se proporciona)
    if (inputDto.tipoTramiteId) {
      const tipoTramiteExists = await this.prismaService.tipoTramite.findUnique({
        where: { id: inputDto.tipoTramiteId },
        select: { id: true },
      });
      if (!tipoTramiteExists)
        return dataErrorValidations({ tipoTramiteId: ['El tipo de trámite no existe'] });
    }

    const codigoTicket = this.generateCodigoTicket();

    const result = await this.prismaService.servicio.create({
      data: {
        codigoTicket,
        clienteId: inputDto.clienteId,
        tipoDocumentoId: inputDto.tipoDocumentoId,
        tipoTramiteId: inputDto.tipoTramiteId,
        observaciones: inputDto.observaciones,
        contenidoFinal: inputDto.contenidoFinal,
        montoTotal: inputDto.montoTotal,
        saldoPendiente: inputDto.montoTotal, // Inicialmente, el saldo pendiente es igual al monto total
        userCreateId: session.usuarioId,
      },
      include: {
        cliente: true,
        tipoDocumento: true,
        tipoTramite: true,
      },
    });

    return dataResponseSuccess<Servicio>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.servicio.findMany({
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
          tipoDocumento: true,
          tipoTramite: true,
        },
      }),
      pagination ? this.prismaService.servicio.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Servicio[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListServicioArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { codigoTicket, clienteId, tipoDocumentoId, tipoTramiteId, montoTotal, saldoPendiente } =
      inputDto.where || {};
    const whereInput: Prisma.ServicioWhereInput = {};

    if (codigoTicket) whereInput.codigoTicket = codigoTicket;
    if (clienteId) whereInput.clienteId = clienteId;
    if (tipoDocumentoId) whereInput.tipoDocumentoId = tipoDocumentoId;
    if (tipoTramiteId) whereInput.tipoTramiteId = tipoTramiteId;
    if (montoTotal !== undefined) whereInput.montoTotal = montoTotal;
    if (saldoPendiente !== undefined) whereInput.saldoPendiente = saldoPendiente;

    const [list, total] = await Promise.all([
      this.prismaService.servicio.findMany({
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
          tipoDocumento: true,
          tipoTramite: true,
        },
      }),
      this.prismaService.servicio.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<Servicio[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const item = await this.prismaService.servicio.findUnique({
      where: { id },
      include: {
        cliente: {
          include: {
            personaNatural: true,
            personaJuridica: true,
          },
        },
        tipoDocumento: true,
        tipoTramite: true,
        historialEstadosServicio: {
          include: {
            estado: true,
            usuario: true,
          },
          orderBy: { fechaCambio: 'desc' },
        },
        responsablesServicio: {
          where: { activo: true },
          include: {
            usuario: true,
          },
        },
      },
    });
    if (!item) return dataResponseError('Servicio no encontrado');
    return dataResponseSuccess<Servicio>({ data: item });
  }

  async update(id: string, updateDto: UpdateServicioDto, session: IToken) {
    const exists = await this.prismaService.servicio.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Servicio no encontrado');

    // Validar cliente si se actualiza
    if (updateDto.clienteId) {
      const clienteExists = await this.prismaService.cliente.findUnique({
        where: { id: updateDto.clienteId },
        select: { id: true },
      });
      if (!clienteExists) return dataResponseError('El cliente no existe');
    }

    // Validar tipo documento si se actualiza
    if (updateDto.tipoDocumentoId) {
      const tipoDocExists = await this.prismaService.tipoDocumento.findUnique({
        where: { id: updateDto.tipoDocumentoId },
        select: { id: true },
      });
      if (!tipoDocExists) return dataResponseError('El tipo de documento no existe');
    }

    const result = await this.prismaService.servicio.update({
      where: { id },
      data: {
        ...updateDto,
        userUpdateId: session.usuarioId,
      },
      include: {
        cliente: true,
        tipoDocumento: true,
      },
    });

    return dataResponseSuccess<Servicio>({ data: result });
  }

  async remove(id: string) {
    const exists = await this.prismaService.servicio.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Servicio no encontrado');

    await this.prismaService.servicio.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Servicio eliminado' });
  }
}
