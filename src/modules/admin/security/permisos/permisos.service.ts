import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PermisosRepository } from './permisos.repository';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { PermisoWhereInput, ListPermisosArgsDto } from './dto/permisos.dto';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@Injectable()
export class PermisosService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permisosRepository: PermisosRepository,
  ) {}

  async findAll(query?: ListFindAllQueryDto) {
    if (query) {
      const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

      const [list, total] = await Promise.all([
        this.prismaService.permiso.findMany({
          skip,
          take,
          orderBy,
          where: { estaActivo: true },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            modulo: true,
            accion: true,
            estaActivo: true,
          },
        }),
        this.prismaService.permiso.count({
          where: { estaActivo: true },
        }),
      ]);

      return dataResponseSuccess({
        data: list,
        pagination: { ...pagination, total },
      });
    } else {
      const list = await this.permisosRepository.findAllActivos();
      return dataResponseSuccess({ data: list });
    }
  }

  async findAllInactivos() {
    const list = await this.permisosRepository.findAllInactivos();
    return dataResponseSuccess({ data: list });
  }
  async setActivo(id: number, activo: boolean) {
    const permiso = await this.permisosRepository.findById(id);
    if (!permiso) return dataResponseError('Permiso no encontrado');
    const updated = await this.permisosRepository.setActivo(id, activo);
    return dataResponseSuccess({ data: updated });
  }

  async filter(inputDto: ListPermisosArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, modulo, accion, estaActivo } = inputDto?.where || {};
    const where: Prisma.PermisoWhereInput = {};

    if (nombre) where.nombre = nombre;
    if (modulo) where.modulo = modulo;
    if (accion) where.accion = accion;
    if (estaActivo !== undefined) where.estaActivo = estaActivo;

    const [list, total] = await Promise.all([
      this.prismaService.permiso.findMany({
        skip,
        take,
        orderBy,
        where,
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          modulo: true,
          accion: true,
          estaActivo: true,
        },
      }),
      this.prismaService.permiso.count({ where }),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  // Deshabilitado: CRUD de permisos es estático. No soporta findOne/update/remove/create
  async findOne() {
    return dataResponseError('Operación no soportada');
  }

  async updateActivo(id: number, updateActivoDto: { estaActivo: boolean }) {
    const permiso = await this.permisosRepository.findById(id);
    if (!permiso) return dataResponseError('Permiso no encontrado');

    const updated = await this.permisosRepository.setActivo(id, updateActivoDto.estaActivo);
    return dataResponseSuccess({ data: updated });
  }

  async update() {
    return dataResponseError('Operación no soportada');
  }

  async assignToRole(roleId: number, permisoIds: number[]) {
    const roleExists = await this.prismaService.rol.findUnique({
      where: { id: roleId },
      select: { id: true },
    });
    if (!roleExists) return dataResponseError('Rol no encontrado');

    if (!Array.isArray(permisoIds) || permisoIds.length === 0)
      return dataResponseError('Debe enviar una lista de permisos');

    const permisosExist = await this.prismaService.permiso.findMany({
      where: { id: { in: permisoIds } },
      select: { id: true },
    });
    if (permisosExist.length !== permisoIds.length)
      return dataResponseError('Algunos permisos no existen');

    const result = await this.prismaService.rol.update({
      where: { id: roleId },
      data: {
        rolPermisos: {
          deleteMany: {},
          create: permisoIds.map((permisoId) => ({ permiso: { connect: { id: permisoId } } })),
        },
      },
      include: { rolPermisos: true },
    });

    return dataResponseSuccess({ data: result });
  }

  async assignToRoleByNames(roleId: number, permisos: string[]) {
    const roleExists = await this.prismaService.rol.findUnique({
      where: { id: roleId },
      select: { id: true },
    });
    if (!roleExists) return dataResponseError('Rol no encontrado');

    if (!Array.isArray(permisos) || permisos.length === 0)
      return dataResponseError('Debe enviar una lista de permisos');

    // Validar que todos existan en el enum
    const enumValues = new Set(Object.values(PermisoEnum));
    const invalid = permisos.filter((p) => !enumValues.has(p as PermisoEnum));
    if (invalid.length) return dataResponseError(`Permisos inválidos: ${invalid.join(', ')}`);

    // Asegurar que existan en tabla permisos (semilla/config previa)
    const permisosDb = await this.prismaService.permiso.findMany({
      where: { nombre: { in: permisos } },
      select: { id: true, nombre: true },
    });
    if (permisosDb.length !== permisos.length)
      return dataResponseError('Algunos permisos no se encuentran creados en BD');

    const result = await this.prismaService.rol.update({
      where: { id: roleId },
      data: {
        rolPermisos: {
          deleteMany: {},
          create: permisosDb.map((p) => ({ permiso: { connect: { id: p.id } } })),
        },
      },
      include: { rolPermisos: true },
    });

    return dataResponseSuccess({ data: result });
  }
}
