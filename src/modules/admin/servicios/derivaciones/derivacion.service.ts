import { Injectable } from '@nestjs/common';
import {
  CreateDerivacionDto,
  CancelarDerivacionDto,
  MarcarVisualizadaDto,
  ListDerivacionArgsDto,
  RechazarDerivacionDto,
} from './dto/derivacion.input.dto';
import { DerivacionesStatsDto } from './dto/derivacion.response';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class DerivacionService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Crear una derivación de servicio a otro funcionario
   * - Cambia el responsable activo del servicio al usuario destino
   */
  async create(inputDto: CreateDerivacionDto, session: IToken) {
    // Validar que el servicio existe
    const servicio = await this.prismaService.servicio.findUnique({
      where: { id: inputDto.servicioId },
      select: { id: true, codigoTicket: true, estaActivo: true },
    });

    if (!servicio) {
      return dataErrorValidations({ servicioId: ['El servicio no existe'] });
    }

    if (!servicio.estaActivo) {
      return dataErrorValidations({
        servicioId: ['El servicio está cerrado, no se puede derivar'],
      });
    }

    // Validar que el usuario destino existe y está activo
    const usuarioDestino = await this.prismaService.usuario.findUnique({
      where: { id: inputDto.usuarioDestinoId },
      select: { id: true, estaActivo: true, nombre: true, apellidos: true },
    });

    if (!usuarioDestino) {
      return dataErrorValidations({ usuarioDestinoId: ['El usuario destino no existe'] });
    }

    if (!usuarioDestino.estaActivo) {
      return dataErrorValidations({
        usuarioDestinoId: ['El usuario destino no está activo'],
      });
    }

    // No permitir derivar a sí mismo
    if (inputDto.usuarioDestinoId === session.usuarioId) {
      return dataErrorValidations({
        usuarioDestinoId: ['No puedes derivar un servicio a ti mismo'],
      });
    }

    // Validar que el usuario origen es responsable activo del servicio
    const responsableActual = await this.prismaService.responsableServicio.findFirst({
      where: {
        servicioId: inputDto.servicioId,
        usuarioId: session.usuarioId,
        activo: true,
      },
    });

    if (!responsableActual) {
      return dataResponseError('No eres responsable activo de este servicio');
    }

    // Usar transacción para crear derivación y cambiar responsable
    const resultado = await this.prismaService.$transaction(async (prisma) => {
      // Desactivar responsable actual
      await prisma.responsableServicio.update({
        where: { id: responsableActual.id },
        data: {
          activo: false,
          fechaBaja: new Date(),
        },
      });

      // Crear nuevo responsable
      await prisma.responsableServicio.create({
        data: {
          servicioId: inputDto.servicioId,
          usuarioId: inputDto.usuarioDestinoId,
          activo: true,
        },
      });

      // Crear la derivación
      const derivacion = await prisma.derivacionServicio.create({
        data: {
          servicioId: inputDto.servicioId,
          usuarioOrigenId: session.usuarioId,
          usuarioDestinoId: inputDto.usuarioDestinoId,
          motivo: inputDto.motivo,
          prioridad: inputDto.prioridad || 'normal',
          comentario: inputDto.comentario,
          estaActiva: true,
          visualizada: false,
        },
        include: {
          servicio: {
            select: {
              id: true,
              codigoTicket: true,
              tipoTramite: {
                select: {
                  nombre: true,
                  colorHex: true,
                  icon: true,
                },
              },
              cliente: {
                select: {
                  id: true,
                  tipo: true,
                  personaNatural: {
                    select: {
                      nombres: true,
                      apellidos: true,
                    },
                  },
                  personaJuridica: {
                    select: {
                      razonSocial: true,
                    },
                  },
                },
              },
              estadoActual: {
                select: {
                  nombre: true,
                  colorHex: true,
                },
              },
            },
          },
          usuarioOrigen: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
            },
          },
          usuarioDestino: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
            },
          },
        },
      });

      // Crear notificación para el usuario destino
      await prisma.notificacion.create({
        data: {
          usuarioId: inputDto.usuarioDestinoId,
          titulo: 'Nueva derivación de servicio',
          mensaje: `Has recibido una derivación del servicio ${servicio.codigoTicket}`,
          tipo: 'info',
          icono: 'pi-arrow-right',
          ruta: `/admin/servicios/${inputDto.servicioId}`,
          userCreateId: session.usuarioId,
        },
      });

      return derivacion;
    });

    return dataResponseSuccess<any>(
      { data: resultado },
      { message: 'Derivación creada exitosamente' },
    );
  }

  /**
   * Cancelar una derivación
   * - Solo si no ha sido visualizada
   * - Reactiva al responsable anterior
   */
  async cancelar(inputDto: CancelarDerivacionDto, session: IToken) {
    // Buscar la derivación
    const derivacion = await this.prismaService.derivacionServicio.findUnique({
      where: { id: inputDto.derivacionId },
      include: {
        servicio: {
          select: {
            id: true,
            codigoTicket: true,
          },
        },
      },
    });

    if (!derivacion) {
      return dataResponseError('La derivación no existe');
    }

    // Validar que la derivación está activa
    if (!derivacion.estaActiva) {
      return dataResponseError('La derivación ya está cancelada');
    }

    // Validar que no ha sido visualizada
    if (derivacion.visualizada) {
      return dataResponseError('No se puede cancelar una derivación que ya ha sido visualizada');
    }

    // Validar que el usuario es quien creó la derivación
    if (derivacion.usuarioOrigenId !== session.usuarioId) {
      return dataResponseError('Solo quien creó la derivación puede cancelarla');
    }

    // Usar transacción para cancelar derivación y restaurar responsable anterior
    const resultado = await this.prismaService.$transaction(async (prisma) => {
      // Marcar derivación como cancelada
      const derivacionCancelada = await prisma.derivacionServicio.update({
        where: { id: inputDto.derivacionId },
        data: {
          estaActiva: false,
          motivoCancelacion: inputDto.motivoCancelacion,
          fechaCancelacion: new Date(),
          usuarioCancelacionId: session.usuarioId,
        },
      });

      // Desactivar responsable actual (usuario destino)
      await prisma.responsableServicio.updateMany({
        where: {
          servicioId: derivacion.servicioId,
          usuarioId: derivacion.usuarioDestinoId,
          activo: true,
        },
        data: {
          activo: false,
          fechaBaja: new Date(),
        },
      });

      // Reactivar responsable anterior (usuario origen)
      const responsableAnterior = await prisma.responsableServicio.findFirst({
        where: {
          servicioId: derivacion.servicioId,
          usuarioId: derivacion.usuarioOrigenId,
        },
        orderBy: {
          fechaAsignacion: 'desc',
        },
      });

      if (responsableAnterior) {
        await prisma.responsableServicio.update({
          where: { id: responsableAnterior.id },
          data: {
            activo: true,
            fechaBaja: null,
          },
        });
      }

      // Crear notificación
      await prisma.notificacion.create({
        data: {
          usuarioId: derivacion.usuarioDestinoId,
          titulo: 'Derivación cancelada',
          mensaje: `La derivación del servicio ${derivacion.servicio.codigoTicket} ha sido cancelada`,
          tipo: 'warning',
          icono: 'pi-times-circle',
          userCreateId: session.usuarioId,
        },
      });

      return derivacionCancelada;
    });

    return dataResponseSuccess<any>(
      { data: resultado },
      { message: 'Derivación cancelada exitosamente' },
    );
  }

  /**
   * Marcar una derivación como visualizada
   */
  async marcarVisualizada(inputDto: MarcarVisualizadaDto, session: IToken) {
    // Buscar la derivación
    const derivacion = await this.prismaService.derivacionServicio.findUnique({
      where: { id: inputDto.derivacionId },
    });

    if (!derivacion) {
      return dataResponseError('La derivación no existe');
    }

    // Validar que el usuario es el destinatario
    if (derivacion.usuarioDestinoId !== session.usuarioId) {
      return dataResponseError('No tienes permiso para marcar esta derivación como visualizada');
    }

    // Validar que no está ya visualizada
    if (derivacion.visualizada) {
      return dataResponseSuccess<any>(
        { data: derivacion },
        { message: 'La derivación ya estaba marcada como visualizada' },
      );
    }

    // Marcar como visualizada
    const derivacionActualizada = await this.prismaService.derivacionServicio.update({
      where: { id: inputDto.derivacionId },
      data: {
        visualizada: true,
        fechaVisualizacion: new Date(),
      },
    });

    return dataResponseSuccess<any>(
      { data: derivacionActualizada },
      { message: 'Derivación marcada como visualizada' },
    );
  }

  /**
   * Filtrar derivaciones de forma genérica (sin restricción de usuario)
   */
  async filter(filters: ListDerivacionArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(filters, true);
    const whereInput: any = {};

    // Aplicar filtros del where si existen
    if (filters.where) {
      const {
        servicioId,
        usuarioOrigenId,
        usuarioDestinoId,
        estaActiva,
        visualizada,
        aceptada,
        prioridad,
      } = filters.where;

      if (servicioId) whereInput.servicioId = servicioId;
      if (usuarioOrigenId) whereInput.usuarioOrigenId = usuarioOrigenId;
      if (usuarioDestinoId) whereInput.usuarioDestinoId = usuarioDestinoId;
      if (estaActiva !== undefined) whereInput.estaActiva = estaActiva;
      if (visualizada !== undefined) whereInput.visualizada = visualizada;
      if (aceptada !== undefined) whereInput.aceptada = aceptada;
      if (prioridad) whereInput.prioridad = prioridad;
    }

    const [data, total] = await Promise.all([
      this.prismaService.derivacionServicio.findMany({
        where: whereInput,
        include: {
          servicio: {
            select: {
              id: true,
              codigoTicket: true,
              tipoTramite: {
                select: {
                  nombre: true,
                  colorHex: true,
                  icon: true,
                },
              },
              cliente: {
                select: {
                  id: true,
                  tipo: true,
                  personaNatural: {
                    select: {
                      nombres: true,
                      apellidos: true,
                    },
                  },
                  personaJuridica: {
                    select: {
                      razonSocial: true,
                    },
                  },
                },
              },
              estadoActual: {
                select: {
                  nombre: true,
                  colorHex: true,
                },
              },
            },
          },
          usuarioOrigen: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
            },
          },
          usuarioDestino: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
            },
          },
        },
        skip,
        take,
        orderBy: orderBy || { fechaDerivacion: 'desc' },
      }),
      this.prismaService.derivacionServicio.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<any>({
      data,
      pagination: { ...pagination, total },
    });
  }

  /**
   * Obtener estadísticas de derivaciones
   */
  async getStats(session: IToken) {
    const [recibidas, enviadas, pendientesPago, finalizados, total] = await Promise.all([
      // Derivaciones pendientes de visualizar (recibidas por el usuario, activas y no visualizadas)
      this.prismaService.derivacionServicio.count({
        where: {
          usuarioDestinoId: session.usuarioId,
          estaActiva: true,
        },
      }),
      // Derivaciones enviadas activas (enviadas por el usuario y aún activas)
      this.prismaService.derivacionServicio.count({
        where: {
          usuarioOrigenId: session.usuarioId,
          estaActiva: true,
        },
      }),
      // Derivaciones aceptadas/visualizadas (totales en el sistema)
      this.prismaService.derivacionServicio.count({
        where: {
          estaActiva: true,
          servicio: {
            estaActivo: true,
            saldoPendiente: { gt: 0 },
          },
        },
      }),
      // Derivaciones finalizadas (totales en el sistema)
      this.prismaService.derivacionServicio.count({
        where: {
          OR: [{ usuarioDestinoId: session.usuarioId }, { usuarioOrigenId: session.usuarioId }],
          estaActiva: false,
        },
      }),
      // Total de derivaciones en el sistema
      this.prismaService.derivacionServicio.count({
        where: {
          estaActiva: true,
          OR: [{ usuarioDestinoId: session.usuarioId }, { usuarioOrigenId: session.usuarioId }],
        },
      }),
    ]);

    const stats: DerivacionesStatsDto = {
      recibidas: recibidas,
      enviadas: enviadas,
      pendientesPago: pendientesPago,
      finalizados: finalizados,
      total,
    };

    return dataResponseSuccess<DerivacionesStatsDto>({ data: stats });
  }

  /**
   * Obtener mis derivaciones pendientes de aceptar
   */
  async findMisDerivacionesPendientes(session: IToken) {
    const derivaciones = await this.prismaService.derivacionServicio.findMany({
      where: {
        usuarioDestinoId: session.usuarioId,
        estaActiva: true,
        aceptada: false,
      },
      orderBy: {
        fechaDerivacion: 'desc',
      },
      include: {
        servicio: {
          select: {
            id: true,
            codigoTicket: true,
            tipoTramite: {
              select: {
                nombre: true,
                colorHex: true,
                icon: true,
              },
            },
            cliente: {
              select: {
                id: true,
                tipo: true,
                personaNatural: {
                  select: {
                    nombres: true,
                    apellidos: true,
                  },
                },
                personaJuridica: {
                  select: {
                    razonSocial: true,
                  },
                },
              },
            },
            estadoActual: {
              select: {
                nombre: true,
                colorHex: true,
              },
            },
          },
        },
        usuarioOrigen: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
      },
    });

    return dataResponseSuccess<any[]>({
      data: derivaciones,
      pagination: {
        total: derivaciones.length,
        page: 1,
        size: derivaciones.length,
        from: 0,
      },
    });
  }

  /**
   * Obtener mis derivaciones enviadas
   */
  async findMisDerivacionesEnviadas(session: IToken) {
    const derivaciones = await this.prismaService.derivacionServicio.findMany({
      where: {
        usuarioOrigenId: session.usuarioId,
      },
      orderBy: {
        fechaDerivacion: 'desc',
      },
      include: {
        servicio: {
          select: {
            id: true,
            codigoTicket: true,
            tipoTramite: {
              select: {
                nombre: true,
                colorHex: true,
                icon: true,
              },
            },
            cliente: {
              select: {
                id: true,
                tipo: true,
                personaNatural: {
                  select: {
                    nombres: true,
                    apellidos: true,
                  },
                },
                personaJuridica: {
                  select: {
                    razonSocial: true,
                  },
                },
              },
            },
            estadoActual: {
              select: {
                nombre: true,
                colorHex: true,
              },
            },
          },
        },
        usuarioDestino: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
      },
    });

    return dataResponseSuccess<any[]>({
      data: derivaciones,
      pagination: {
        total: derivaciones.length,
        page: 1,
        size: derivaciones.length,
        from: 0,
      },
    });
  }

  /**
   * Obtener detalle de una derivación
   */
  async findOne(id: number, session: IToken) {
    const derivacion = await this.prismaService.derivacionServicio.findUnique({
      where: { id },
      include: {
        servicio: {
          include: {
            tipoTramite: true,
            tipoDocumento: true,
            estadoActual: true,
            cliente: {
              include: {
                personaNatural: true,
                personaJuridica: true,
              },
            },
          },
        },
        usuarioOrigen: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
        usuarioDestino: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
      },
    });

    if (!derivacion) {
      return dataResponseError('La derivación no existe');
    }

    // Validar que el usuario tiene acceso
    if (
      derivacion.usuarioOrigenId !== session.usuarioId &&
      derivacion.usuarioDestinoId !== session.usuarioId
    ) {
      return dataResponseError('No tienes permiso para ver esta derivación');
    }

    // Si es el usuario destino y no la ha visualizado, marcarla automáticamente
    if (derivacion.usuarioDestinoId === session.usuarioId && !derivacion.visualizada) {
      await this.prismaService.derivacionServicio.update({
        where: { id },
        data: {
          visualizada: true,
          fechaVisualizacion: new Date(),
        },
      });
      derivacion.visualizada = true;
      derivacion.fechaVisualizacion = new Date();
    }

    return dataResponseSuccess<any>({ data: derivacion });
  }

  /**
   * Obtener historial de derivaciones de un servicio
   */
  async findByServicio(servicioId: string) {
    const derivaciones = await this.prismaService.derivacionServicio.findMany({
      where: {
        servicioId,
      },
      orderBy: {
        fechaDerivacion: 'asc',
      },
      include: {
        usuarioOrigen: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
        usuarioDestino: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
      },
    });

    return dataResponseSuccess<any[]>({
      data: derivaciones,
      pagination: {
        total: derivaciones.length,
        page: 1,
        size: derivaciones.length,
        from: 0,
      },
    });
  }

  /**
   * Rechazar una derivación recibida
   * - El receptor puede rechazar y devolver al emisor
   * - Similar a cancelar pero desde el punto de vista del receptor
   * - Restaura el responsable al emisor original
   */
  async rechazar(inputDto: RechazarDerivacionDto, session: IToken) {
    // Buscar la derivación
    const derivacion = await this.prismaService.derivacionServicio.findUnique({
      where: { id: inputDto.derivacionId },
      include: {
        servicio: {
          select: {
            id: true,
            codigoTicket: true,
          },
        },
        usuarioOrigen: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    if (!derivacion) {
      return dataResponseError('Derivación no encontrada');
    }

    // Validar que el usuario actual es el destinatario
    if (derivacion.usuarioDestinoId !== session.usuarioId) {
      return dataResponseError('No tienes permiso para rechazar esta derivación');
    }

    // Validar que la derivación está activa
    if (!derivacion.estaActiva) {
      return dataResponseError('La derivación ya está inactiva');
    }

    // Validar que no fue aceptada previamente
    if (derivacion.aceptada) {
      return dataResponseError('Esta derivación ya fue aceptada, no se puede rechazar');
    }

    // Usar transacción para rechazar derivación y restaurar responsable anterior
    const resultado = await this.prismaService.$transaction(async (prisma) => {
      // Marcar derivación como rechazada (inactiva)
      const derivacionRechazada = await prisma.derivacionServicio.update({
        where: { id: inputDto.derivacionId },
        data: {
          estaActiva: false,
          motivoCancelacion: `Rechazado por receptor: ${inputDto.motivoRechazo}`,
          fechaCancelacion: new Date(),
          usuarioCancelacionId: session.usuarioId,
        },
      });

      // Desactivar responsable actual (usuario destino/receptor)
      await prisma.responsableServicio.updateMany({
        where: {
          servicioId: derivacion.servicioId,
          usuarioId: derivacion.usuarioDestinoId,
          activo: true,
        },
        data: {
          activo: false,
          fechaBaja: new Date(),
        },
      });

      // Reactivar responsable anterior (usuario origen/emisor)
      const responsableAnterior = await prisma.responsableServicio.findFirst({
        where: {
          servicioId: derivacion.servicioId,
          usuarioId: derivacion.usuarioOrigenId,
        },
        orderBy: {
          fechaAsignacion: 'desc',
        },
      });

      if (responsableAnterior) {
        await prisma.responsableServicio.update({
          where: { id: responsableAnterior.id },
          data: {
            activo: true,
            fechaBaja: null,
          },
        });
      }

      // Notificar al usuario origen del rechazo
      await prisma.notificacion.create({
        data: {
          usuarioId: derivacion.usuarioOrigenId,
          titulo: 'Derivación rechazada',
          mensaje: `Tu derivación del servicio ${derivacion.servicio.codigoTicket} fue rechazada. Motivo: ${inputDto.motivoRechazo}`,
          tipo: 'warning',
          icono: 'pi-times-circle',
          ruta: `/admin/servicios/${derivacion.servicioId}`,
          userCreateId: session.usuarioId,
        },
      });

      return derivacionRechazada;
    });

    return dataResponseSuccess<any>(
      { data: resultado },
      { message: 'Derivación rechazada exitosamente, el servicio ha vuelto al emisor' },
    );
  }
}
