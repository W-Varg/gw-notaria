import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import {
  CreateTipoProductoDto,
  UpdateTipoProductoDto,
  ListTipoProductoArgsDto,
} from './dto/tipos-producto.input.dto';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';

@Injectable()
export class TiposProductoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateTipoProductoDto) {
    const exists = await this.prismaService.tipoProducto.findUnique({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (exists) return dataResponseError('El tipo de producto ya existe');
    const result = await this.prismaService.tipoProducto.create({
      data: { nombre: inputDto.nombre },
    });
    return dataResponseSuccess({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.tipoProducto.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.tipoProducto.count() : Promise.resolve(0),
    ]);

    if (pagination) {
      return dataResponseSuccess({
        data: list,
        pagination: { total, page: query.page || 1, size: query.size || 10 },
      });
    }
    return dataResponseSuccess({ data: list });
  }

  async filter(inputDto: ListTipoProductoArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto);

    const whereInput = this.buildWhereInput(inputDto.where);
    const select = inputDto.select ? this.buildSelect(inputDto.select) : undefined;

    const [list, total] = await Promise.all([
      this.prismaService.tipoProducto.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        select,
      }),
      pagination
        ? this.prismaService.tipoProducto.count({ where: whereInput })
        : Promise.resolve(0),
    ]);

    if (pagination) {
      return dataResponseSuccess({
        data: list,
        pagination: { total, page: inputDto.page || 1, size: inputDto.size || 10 },
      });
    }
    return dataResponseSuccess({ data: list });
  }

  private buildWhereInput(where?: any): Prisma.TipoProductoWhereInput {
    if (!where) return {};

    const whereInput: Prisma.TipoProductoWhereInput = {};

    if (where.nombre) {
      whereInput.nombre = where.nombre;
    }

    return whereInput;
  }

  private buildSelect(select: any): Prisma.TipoProductoSelect {
    const defaultSelect: Prisma.TipoProductoSelect = {
      id: true,
      nombre: true,
    };

    if (!select) return defaultSelect;

    return {
      id: select.id !== false,
      nombre: select.nombre !== false,
    };
  }

  async findOne(id: string) {
    const item = await this.prismaService.tipoProducto.findUnique({ where: { id } });
    if (!item) return dataResponseError('Tipo de producto no encontrado');
    return dataResponseSuccess({ data: item });
  }

  async update(id: string, inputDto: UpdateTipoProductoDto) {
    const exists = await this.prismaService.tipoProducto.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Tipo de producto no encontrado');

    if (inputDto.nombre) {
      const nameExists = await this.prismaService.tipoProducto.findFirst({
        where: { nombre: inputDto.nombre, id: { not: id } },
        select: { id: true },
      });
      if (nameExists) return dataResponseError('Ya existe un tipo con ese nombre');
    }

    const result = await this.prismaService.tipoProducto.update({ where: { id }, data: inputDto });
    return dataResponseSuccess({ data: result });
  }

  async remove(id: string) {
    // query de tipoProducto, y verificar si existe al menos un producto asociado
    const hasProducts = await this.prismaService.producto.count({
      where: { tipoProductoId: id },
    });

    if (hasProducts > 0) {
      return dataResponseError('El tipo de producto tiene productos asociados');
    }
    const exists = await this.prismaService.tipoProducto.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Tipo de producto no encontrado');
    await this.prismaService.tipoProducto.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Tipo de producto eliminado' });
  }
}
