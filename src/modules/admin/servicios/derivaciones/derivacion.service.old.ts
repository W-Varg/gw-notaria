import { Injectable } from '@nestjs/common';
import {
  CreateDerivacionDto,
  RechazarDerivacionDto,
  ListDerivacionArgsDto,
} from './dto/derivacion.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { DerivacionEntity } from './derivacion.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { IToken } from '../../../../common/decorators/token.decorator';

@Injectable()
export class DerivacionService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Crear una derivación de servicio a otro funcionario
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

    // Crear la derivación
    const derivacion = await this.prismaService.derivacionServicio.create({
      data: {
        servicioId: inputDto.servicioId,
        usuarioOrigenId: session.usuarioId,
        usuarioDestinoId: inputDto.usuarioDestinoId,
        motivo: inputDto.motivo,
        prioridad: inputDto.prioridad || 'normal',
        comentario: inputDto.comentario,
      },
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
    await this.prismaService.notificacion.create({
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

    return dataResponseSuccess<any>(
      { data: derivacion },
      { message: 'Derivación creada exitosamente' },
    );
  }

  /**
   * Rechazar una derivación recibida
   */
  async rechazar(id: number, inputDto: RechazarDerivacionDto, session: IToken) {
    // Buscar la derivación
    const derivacion = await this.prismaService.derivacionServicio.findUnique({
      where: { id },
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

    // Validar que no fue aceptada previamente
    if (derivacion.aceptada) {
      return dataResponseError('Esta derivación ya fue aceptada, no se puede rechazar');
    }

    // Eliminar la derivación (rechazar)
    await this.prismaService.derivacionServicio.delete({
      where: { id },
    });

    // Notificar al usuario origen del rechazo
    await this.prismaService.notificacion.create({
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

    return dataResponseSuccess({}, { message: 'Derivación rechazada exitosamente' });
  }

  /**
   * Filtrar derivaciones con criterios avanzados
   * Permite a super admins ver derivaciones de otros funcionarios
   * Filtros: rango de fechas, trámite, funcionario, estado, prioridad
   */
  async filter(inputDto: ListDerivacionArgsDto, session: IToken) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const {
      servicioId,
      usuarioOrigenId,
      usuarioDestinoId,
      aceptada,
      fechaDerivacion,
      fechaAceptacion,
      tramiteId,
      prioridad,
    } = inputDto.where || {};
    const whereInput: any = {};

    // Filtros básicos
    if (servicioId) whereInput.servicioId = servicioId;
    if (usuarioOrigenId) whereInput.usuarioOrigenId = usuarioOrigenId;
    if (usuarioDestinoId) whereInput.usuarioDestinoId = usuarioDestinoId;
    if (aceptada !== undefined) whereInput.aceptada = aceptada;
    if (prioridad) whereInput.prioridad = prioridad;

    // Filtro por rango de fechas de derivación
    if (fechaDerivacion) {
      whereInput.fechaDerivacion = fechaDerivacion;
    }

    // Filtro por rango de fechas de aceptación
    if (fechaAceptacion) {
      whereInput.fechaAceptacion = fechaAceptacion;
    }

    // Filtro por tipo de trámite del servicio
    if (tramiteId) {
      whereInput.servicio = {
        tipoTramiteId: tramiteId,
      };
    }

    const [list, total] = await Promise.all([
      this.prismaService.derivacionServicio.findMany({
        where: whereInput,
        skip,
        take,
        orderBy: orderBy || { fechaDerivacion: 'desc' },
        include: {
          servicio: {
            select: {
              id: true,
              codigoTicket: true,
              tipoTramite: {
                select: {
                  id: true,
                  nombre: true,
                  descripcion: true,
                },
              },
              cliente: {
                select: {
                  id: true,
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
      }),
      this.prismaService.derivacionServicio.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<any[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  /**
   * Listar derivaciones recibidas por el usuario actual (pendientes de aceptar)
   */
  async findMisDerivacionesPendientes(session: IToken) {
    const derivaciones = await this.prismaService.derivacionServicio.findMany({
      where: {
        usuarioDestinoId: session.usuarioId,
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
            cliente: {
              select: {
                id: true,
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
   * Listar derivaciones enviadas por el usuario actual
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
            cliente: {
              select: {
                id: true,
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
   * Obtener una derivación por ID
   */
  async findOne(id: number) {
    const derivacion = await this.prismaService.derivacionServicio.findUnique({
      where: { id },
      include: {
        servicio: {
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
      return dataResponseError('Derivación no encontrada');
    }

    return dataResponseSuccess({ data: derivacion });
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
}
