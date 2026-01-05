import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateServicioDto,
  UpdateServicioDto,
  ListServicioArgsDto,
} from './dto/servicio.input.dto';
import {
  ServiciosDashboardFilterDto,
  ServiciosStatsDto,
  UpdateServicioProgresoDto,
  RegistrarPagoServicioDto,
} from './dto/servicio.input-extended.dto';
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

  /**
   * Obtener estadísticas del dashboard
   */
  async getStats(): Promise<any> {
    const [enProceso, pendientePago, finalizados, total, financials] = await Promise.all([
      this.prismaService.servicio.count({
        where: {
          estaActivo: true,
          estadoActual: { nombre: 'En Proceso' },
        },
      }),
      this.prismaService.servicio.count({
        where: {
          estaActivo: true,
          saldoPendiente: { gt: 0 },
          NOT: { estadoActual: { nombre: 'Finalizado' } },
        },
      }),
      this.prismaService.servicio.count({
        where: {
          estaActivo: true,
          estadoActual: { nombre: 'Finalizado' },
        },
      }),
      this.prismaService.servicio.count({ where: { estaActivo: true } }),
      this.prismaService.servicio.aggregate({
        where: { estaActivo: true },
        _sum: {
          saldoPendiente: true,
          montoTotal: true,
        },
      }),
    ]);

    const stats: ServiciosStatsDto = {
      enProceso,
      pendientePago,
      finalizados,
      total,
      totalPendienteCobro: Number(financials._sum.saldoPendiente) || 0,
      totalIngresos: (Number(financials._sum.montoTotal) || 0) - (Number(financials._sum.saldoPendiente) || 0),
    };

    return dataResponseSuccess<ServiciosStatsDto>({ data: stats });
  }

  /**
   * Listar servicios para el dashboard con filtros simplificados
   */
  async findAllDashboard(filters: ServiciosDashboardFilterDto) {
    const { estadoFiltro, search, page = 1, pageSize = 6 } = filters;

    let where: Prisma.ServicioWhereInput = { estaActivo: true };

    // Aplicar filtro por estado
    switch (estadoFiltro) {
      case 'EN_PROCESO':
        where.estadoActual = { nombre: 'En Proceso' };
        break;
      case 'PENDIENTE_PAGO':
        where.saldoPendiente = { gt: 0 };
        where.NOT = { estadoActual: { nombre: 'Finalizado' } };
        break;
      case 'FINALIZADO':
        where.estadoActual = { nombre: 'Finalizado' };
        break;
      // 'TODOS' no agrega filtro
    }

    // Aplicar búsqueda de texto
    if (search) {
      where.OR = [
        { codigoTicket: { contains: search, mode: 'insensitive' } },
        { observaciones: { contains: search, mode: 'insensitive' } },
        {
          cliente: {
            OR: [
              {
                personaNatural: {
                  OR: [
                    { nombres: { contains: search, mode: 'insensitive' } },
                    { apellidos: { contains: search, mode: 'insensitive' } },
                  ],
                },
              },
              {
                personaJuridica: {
                  razonSocial: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prismaService.servicio.findMany({
        where,
        include: {
          cliente: {
            include: {
              personaNatural: true,
              personaJuridica: true,
            },
          },
          tipoDocumento: true,
          tipoTramite: true,
          estadoActual: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { fechaInicio: 'desc' },
      }),
      this.prismaService.servicio.count({ where }),
    ]);

    return dataResponseSuccess<Servicio[]>({
      data,
      pagination: {
        total,
        page,
        size: pageSize,
        from: (page - 1) * pageSize,
      },
    });
  }

  /**
   * Actualizar el estado/progreso de un servicio
   */
  async updateProgreso(id: string, dto: UpdateServicioProgresoDto, usuarioId: string) {
    const servicio = await this.prismaService.servicio.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!servicio) return dataResponseError('Servicio no encontrado');

    // Validar que el estado existe
    const estadoExists = await this.prismaService.estadoTramite.findUnique({
      where: { id: dto.estadoActualId },
      select: { id: true },
    });

    if (!estadoExists) return dataResponseError('El estado no existe');

    // Actualizar el servicio
    const updated = await this.prismaService.servicio.update({
      where: { id },
      data: { estadoActualId: dto.estadoActualId },
      include: {
        cliente: true,
        tipoDocumento: true,
        tipoTramite: true,
        estadoActual: true,
      },
    });

    // Crear registro en historial
    await this.prismaService.historialEstadosServicio.create({
      data: {
        servicioId: id,
        estadoId: dto.estadoActualId,
        comentario: dto.comentario,
        fechaCambio: new Date(),
        usuarioId: usuarioId,
      },
    });

    return dataResponseSuccess<Servicio>({ data: updated });
  }

  /**
   * Registrar un pago para un servicio
   */
  async registrarPago(id: string, dto: RegistrarPagoServicioDto, usuarioId: string) {
    const servicio = await this.prismaService.servicio.findUnique({
      where: { id },
      select: { id: true, saldoPendiente: true },
    });

    if (!servicio) return dataResponseError('Servicio no encontrado');

    const saldoPendienteNum = Number(servicio.saldoPendiente);
    
    if (dto.monto > saldoPendienteNum) {
      return dataErrorValidations({
        monto: ['El monto del pago no puede ser mayor al saldo pendiente'],
      });
    }

    const nuevoSaldo = saldoPendienteNum - dto.monto;

    // Buscar o crear estado "Pagado" o "En Proceso"
    const estadoPagado = await this.prismaService.estadoTramite.findFirst({
      where: { nombre: { in: ['Pagado', 'En Proceso'] } },
      orderBy: { nombre: 'desc' }, // Preferir "Pagado" sobre "En Proceso"
    });

    // Registrar pago y actualizar saldo en una transacción
    const result = await this.prismaService.$transaction(async (prisma) => {
      // Registrar pago
      await prisma.pagosIngresos.create({
        data: {
          monto: dto.monto,
          tipoPago: dto.tipoPago,
          cuentaBancariaId: dto.cuentaBancariaId,
          numeroConstancia: dto.numeroConstancia,
          concepto: dto.concepto || `Pago de servicio ${id}`,
          servicioId: id,
          usuarioRegistroId: usuarioId,
        },
      });

      // Actualizar saldo
      const updated = await prisma.servicio.update({
        where: { id },
        data: { saldoPendiente: nuevoSaldo },
        include: {
          cliente: true,
          tipoDocumento: true,
          tipoTramite: true,
          estadoActual: true,
        },
      });

      // Si el saldo llegó a 0 y hay un estado disponible, cambiar estado
      if (nuevoSaldo === 0 && estadoPagado) {
        await prisma.servicio.update({
          where: { id },
          data: { estadoActualId: estadoPagado.id },
        });

        await prisma.historialEstadosServicio.create({
          data: {
            servicioId: id,
            estadoId: estadoPagado.id,
            comentario: 'Pago completado',
            fechaCambio: new Date(),
            usuarioId: usuarioId,
          },
        });
      }

      return updated;
    });

    return dataResponseSuccess<Servicio>({ data: result });
  }
}
