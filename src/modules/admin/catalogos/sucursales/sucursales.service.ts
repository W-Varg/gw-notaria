import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import {
  CreateSucursalDto,
  UpdateSucursalDto,
  ListSucursalArgsDto,
  SucursalWhereInputAdvanced,
} from './dto/sucursales.input.dto';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';

@Injectable()
export class SucursalesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateSucursalDto) {
    const result = await this.prismaService.sucursal.create({ data: inputDto });
    return dataResponseSuccess({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.sucursal.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.sucursal.count() : Promise.resolve(0),
    ]);

    if (pagination) {
      return dataResponseSuccess({
        data: list,
        pagination: { total, page: query.page || 1, size: query.size || 10 },
      });
    }
    return dataResponseSuccess({ data: list });
  }

  async filter(inputDto: ListSucursalArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto);

    const whereInput = this.buildWhereInput(inputDto.where);
    const select = inputDto.select ? this.buildSelect(inputDto.select) : undefined;

    const [list, total] = await Promise.all([
      this.prismaService.sucursal.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        select,
      }),
      pagination ? this.prismaService.sucursal.count({ where: whereInput }) : Promise.resolve(0),
    ]);

    if (pagination) {
      return dataResponseSuccess({
        data: list,
        pagination: { total, page: inputDto.page || 1, size: inputDto.size || 10 },
      });
    }
    return dataResponseSuccess({ data: list });
  }

  private buildWhereInput(where?: SucursalWhereInputAdvanced): Prisma.SucursalWhereInput {
    if (!where) return {};

    const whereInput: Prisma.SucursalWhereInput = {};

    if (where.nombre) {
      whereInput.nombre =
        typeof where.nombre === 'string' ? { contains: where.nombre } : where.nombre;
    }

    if (where.direccion) {
      whereInput.direccion =
        typeof where.direccion === 'string' ? { contains: where.direccion } : where.direccion;
    }

    if (where.ciudad) {
      whereInput.ciudad =
        typeof where.ciudad === 'string' ? { contains: where.ciudad } : where.ciudad;
    }

    if (where.telefono) {
      whereInput.telefono = where.telefono;
    }

    if (where.estaActiva !== undefined) {
      whereInput.estaActiva = where.estaActiva;
    }

    return whereInput;
  }

  private buildSelect(select: any): Prisma.SucursalSelect {
    const defaultSelect: Prisma.SucursalSelect = {
      id: true,
      nombre: true,
      direccion: true,
      ciudad: true,
      telefono: true,
      latitud: true,
      longitud: true,
      estaActiva: true,
      fechaCreacion: true,
      fechaActualizacion: true,
    };

    if (!select) return defaultSelect;

    return {
      id: select.id !== false,
      nombre: select.nombre !== false,
      direccion: select.direccion !== false,
      ciudad: select.ciudad !== false,
      telefono: select.telefono !== false,
      latitud: select.latitud !== false,
      longitud: select.longitud !== false,
      estaActiva: select.estaActiva !== false,
      fechaCreacion: select.fechaCreacion !== false,
      fechaActualizacion: select.fechaActualizacion !== false,
    };
  }

  async findOne(id: string) {
    const item = await this.prismaService.sucursal.findUnique({ where: { id } });
    if (!item) return dataResponseError('Sucursal no encontrada');
    return dataResponseSuccess({ data: item });
  }

  async update(id: string, inputDto: UpdateSucursalDto) {
    const exists = await this.prismaService.sucursal.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Sucursal no encontrada');
    const result = await this.prismaService.sucursal.update({ where: { id }, data: inputDto });
    return dataResponseSuccess({ data: result });
  }

  async remove(id: string) {
    // Verificar si la sucursal tiene relaciones que impiden su eliminación
    const hasEmployees = await this.prismaService.empleado.count({ where: { sucursalId: id } });
    const hasInventories = await this.prismaService.inventario.count({ where: { sucursalId: id } });
    const hasSchedules = await this.prismaService.horarioAtencion.count({
      where: { sucursalId: id },
    });
    const hasDeliveries = await this.prismaService.entrega.count({ where: { sucursalId: id } });
    const hasOrders = await this.prismaService.pedido.count({ where: { sucursalId: id } });
    const hasVariantInventories = await this.prismaService.inventarioVariante.count({
      where: { sucursalId: id },
    });
    const hasInventoryMovements = await this.prismaService.inventarioMovimiento.count({
      where: { sucursalId: id },
    });

    if (
      hasEmployees > 0 ||
      hasInventories > 0 ||
      hasSchedules > 0 ||
      hasDeliveries > 0 ||
      hasOrders > 0 ||
      hasVariantInventories > 0 ||
      hasInventoryMovements > 0
    ) {
      return dataResponseError('La sucursal tiene registros asociados y no puede ser eliminada');
    }

    const exists = await this.prismaService.sucursal.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Sucursal no encontrada');
    await this.prismaService.sucursal.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Sucursal eliminada' });
  }
}
