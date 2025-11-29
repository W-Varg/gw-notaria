import { Injectable } from '@nestjs/common';
import {
  CreateEmpleadoDto,
  ListEmpleadoArgsDto,
  UpdateEmpleadoDto,
} from './dto/empleados.input.dto';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@Injectable()
export class EmpleadosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateEmpleadoDto) {
    const { usuarioId, sucursalId, rolesIds, ...empleadoData } = inputDto;

    // Verificar que el usuario existe
    const usuarioExist = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nombre: true, apellidos: true },
    });

    if (!usuarioExist) {
      return dataResponseError('El usuario especificado no existe');
    }

    // Verificar que no existe ya un empleado para este usuario
    const existingEmpleado = await this.prismaService.empleado.findUnique({
      where: { usuarioId },
      select: { id: true },
    });

    if (existingEmpleado) {
      return dataResponseError('Ya existe un empleado registrado para este usuario');
    }

    // Verificar sucursal si se especifica
    if (sucursalId) {
      const sucursalExist = await this.prismaService.sucursal.findUnique({
        where: { id: sucursalId },
        select: { id: true },
      });

      if (!sucursalExist) {
        return dataResponseError('La sucursal especificada no existe');
      }
    }

    // Verificar roles si se especifican
    if (rolesIds && rolesIds.length > 0) {
      const rolesExist = await this.prismaService.rol.findMany({
        where: { id: { in: rolesIds } },
        select: { id: true },
      });

      if (rolesExist.length !== rolesIds.length) {
        return dataResponseError('Uno o más roles no existen');
      }
    }

    // Crear empleado y actualizar roles del usuario en una transacción
    const result = await this.prismaService.$transaction(async (prisma) => {
      // Crear el empleado
      const empleado = await prisma.empleado.create({
        data: {
          usuarioId,
          sucursalId,
          ...empleadoData,
          fechaContratacion: new Date(empleadoData.fechaContratacion),
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
              roles: {
                include: {
                  rol: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              ciudad: true,
            },
          },
        },
      });

      // Si se especificaron roles, actualizar los roles del usuario
      if (rolesIds && rolesIds.length > 0) {
        // Eliminar roles existentes del usuario
        await prisma.usuarioRol.deleteMany({
          where: { usuarioId },
        });

        // Crear nuevos roles
        await prisma.usuarioRol.createMany({
          data: rolesIds.map((rolId) => ({
            usuarioId,
            rolId,
          })),
        });

        // Obtener usuario actualizado con roles
        const usuarioActualizado = await prisma.usuario.findUnique({
          where: { id: usuarioId },
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
            roles: {
              include: {
                rol: true,
              },
            },
          },
        });

        empleado.usuario = usuarioActualizado;
      }

      return empleado;
    });

    return dataResponseSuccess({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.empleado.findMany({
        skip,
        take,
        orderBy,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
              roles: {
                include: {
                  rol: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              ciudad: true,
            },
          },
        },
        where: { estaActivo: true },
      }),
      this.prismaService.empleado.count({
        where: { estaActivo: true },
      }),
    ]);

    if (pagination) {
      return dataResponseSuccess({
        data: list,
        pagination: { ...pagination, total },
      });
    }

    return dataResponseSuccess({ data: list });
  }

  async filter(inputDto: ListEmpleadoArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { sucursalId, cargo, fechaContratacion, estaActivo } = inputDto?.where || {};
    const where: Prisma.EmpleadoWhereInput = {};

    if (sucursalId) where.sucursalId = sucursalId;
    if (cargo) where.cargo = cargo;
    if (fechaContratacion) where.fechaContratacion = fechaContratacion;
    if (estaActivo !== undefined) where.estaActivo = estaActivo;

    const [list, total] = await Promise.all([
      this.prismaService.empleado.findMany({
        skip,
        take,
        orderBy,
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
              roles: {
                include: {
                  rol: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              ciudad: true,
            },
          },
        },
      }),
      this.prismaService.empleado.count({ where }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const empleado = await this.prismaService.empleado.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
            roles: {
              include: {
                rol: true,
              },
            },
          },
        },
        sucursal: {
          select: {
            id: true,
            nombre: true,
            ciudad: true,
          },
        },
      },
    });

    if (!empleado) {
      return dataResponseError('Empleado no encontrado');
    }

    return dataResponseSuccess({ data: empleado });
  }

  async update(id: string, updateEmpleadoDto: UpdateEmpleadoDto) {
    const { sucursalId, rolesIds, ...updateData } = updateEmpleadoDto;

    // Verificar que el empleado existe y obtener usuarioId
    const empleadoExist = await this.prismaService.empleado.findUnique({
      where: { id },
      select: { id: true, usuarioId: true },
    });

    if (!empleadoExist) {
      return dataResponseError('Empleado no encontrado');
    }

    // Verificar sucursal si se especifica
    if (sucursalId) {
      const sucursalExist = await this.prismaService.sucursal.findUnique({
        where: { id: sucursalId },
        select: { id: true },
      });

      if (!sucursalExist) {
        return dataResponseError('La sucursal especificada no existe');
      }
    }

    // Verificar roles si se especifican
    if (rolesIds && rolesIds.length > 0) {
      const rolesExist = await this.prismaService.rol.findMany({
        where: { id: { in: rolesIds } },
        select: { id: true },
      });

      if (rolesExist.length !== rolesIds.length) {
        return dataResponseError('Uno o más roles no existen');
      }
    }

    // Actualizar empleado y roles del usuario en una transacción
    const result = await this.prismaService.$transaction(async (prisma) => {
      // Actualizar empleado
      const empleado = await prisma.empleado.update({
        where: { id },
        data: {
          ...updateData,
          ...(sucursalId !== undefined && { sucursalId }),
          ...(updateData.fechaContratacion && {
            fechaContratacion: new Date(updateData.fechaContratacion),
          }),
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
              roles: {
                include: {
                  rol: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              ciudad: true,
            },
          },
        },
      });

      // Si se especificaron roles, actualizar los roles del usuario
      if (rolesIds && rolesIds.length > 0) {
        // Eliminar roles existentes del usuario
        await prisma.usuarioRol.deleteMany({
          where: { usuarioId: empleadoExist.usuarioId },
        });

        // Crear nuevos roles
        await prisma.usuarioRol.createMany({
          data: rolesIds.map((rolId) => ({
            usuarioId: empleadoExist.usuarioId,
            rolId,
          })),
        });

        // Obtener usuario actualizado con roles
        const usuarioActualizado = await prisma.usuario.findUnique({
          where: { id: empleadoExist.usuarioId },
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
            roles: {
              include: {
                rol: true,
              },
            },
          },
        });

        empleado.usuario = usuarioActualizado;
      }

      return empleado;
    });

    return dataResponseSuccess({ data: result });
  }

  async remove(id: string) {
    const empleadoExist = await this.prismaService.empleado.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!empleadoExist) {
      return dataResponseError('Empleado no encontrado');
    }

    // Soft delete - marcar como inactivo
    const result = await this.prismaService.empleado.update({
      where: { id },
      data: { estaActivo: false },
    });

    return dataResponseSuccess({ data: result });
  }

  async assignSucursal(empleadoId: string, sucursalId: string | null) {
    const empleadoExist = await this.prismaService.empleado.findUnique({
      where: { id: empleadoId },
      select: { id: true },
    });

    if (!empleadoExist) {
      return dataResponseError('Empleado no encontrado');
    }

    // Verificar sucursal si se especifica
    if (sucursalId) {
      const sucursalExist = await this.prismaService.sucursal.findUnique({
        where: { id: sucursalId },
        select: { id: true },
      });

      if (!sucursalExist) {
        return dataResponseError('La sucursal especificada no existe');
      }
    }

    const result = await this.prismaService.empleado.update({
      where: { id: empleadoId },
      data: { sucursalId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
        sucursal: sucursalId
          ? {
              select: {
                id: true,
                nombre: true,
                ciudad: true,
              },
            }
          : false,
      },
    });

    return dataResponseSuccess({ data: result });
  }
}
