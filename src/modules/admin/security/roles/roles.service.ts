import { Injectable } from '@nestjs/common';
import { CreateRolDto, ListRoleArgsDto, UpdateRoleDto } from './dto/roles.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Role } from './role.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateRolDto) {
    const { permisosIds, ...rolData } = inputDto;
    const permisosExist = await this.prismaService.permiso.findMany({
      where: { id: { in: permisosIds || [] } },
      select: { id: true },
    });

    if (permisosIds && permisosExist.length !== permisosIds.length) {
      return dataResponseError('No existen los permisos indicados');
    }

    const existingRole = await this.prismaService.rol.findUnique({
      where: { nombre: rolData.nombre },
      select: { id: true },
    });

    if (existingRole) return dataResponseError('El rol ya existe');

    const result = await this.prismaService.rol.create({
      data: {
        ...rolData,
        rolPermisos: {
          create: permisosIds?.map((permisoId) => ({
            permiso: { connect: { id: permisoId } },
          })),
        },
      },
    });
    return dataResponseSuccess<Role>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    // Ejecutar queries en paralelo cuando sea necesario
    const [list, total] = await Promise.all([
      this.prismaService.rol.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.rol.count() : Promise.resolve(undefined),
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Role[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListRoleArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, descripcion, estaActivo } = inputDto?.where || {};
    const whereInput: Prisma.RolWhereInput = {};

    if (nombre) whereInput.nombre = nombre;
    if (descripcion) whereInput.descripcion = descripcion;
    if (estaActivo !== undefined) whereInput.estaActivo = estaActivo;

    const [list, total] = await Promise.all([
      this.prismaService.rol.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
      }),
      this.prismaService.rol.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<Role[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const rol = await this.prismaService.rol.findUnique({
      where: { id },
      include: { rolPermisos: { include: { permiso: true } } },
    });
    if (!rol) return dataResponseError('Rol no encontrado');
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const existingRole = await this.prismaService.rol.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingRole) return dataResponseError('Rol no encontrado');

    const { permisosIds, ...rolData } = updateRoleDto;

    if (permisosIds) {
      const permisosExist = await this.prismaService.permiso.findMany({
        where: { id: { in: permisosIds } },
        select: { id: true },
      });

      if (permisosExist.length !== permisosIds.length) {
        return dataResponseError('No existen los permisos indicados');
      }
    }

    const result = await this.prismaService.rol
      .update({
        where: { id },
        data: {
          ...rolData,
          rolPermisos: {
            deleteMany: {},
            create: permisosIds?.map((permisoId) => ({
              permiso: { connect: { id: permisoId } },
            })),
          },
        },
        include: { rolPermisos: true },
      })
      .catch((error) => {
        return dataResponseError(error.message);
      });

    return result;
  }

  async remove(id: number) {
    const existingRole = await this.prismaService.rol.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingRole) return dataResponseError('Rol no encontrado');

    return this.prismaService.rol.delete({ where: { id } });
  }
}
