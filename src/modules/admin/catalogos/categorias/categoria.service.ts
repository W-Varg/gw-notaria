import { Injectable } from '@nestjs/common';
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
  ListCategoriaArgsDto,
} from './dto/categoria.input.dto';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Categoria, CategoriaDetail } from './categoria.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@Injectable()
export class CategoriaService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateCategoriaDto) {
    const exists = await this.prismaService.categoria.findUnique({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (exists) return dataResponseError('La categoría ya existe');

    const result = await this.prismaService.categoria.create({
      data: inputDto,
    });
    return dataResponseSuccess<Categoria>({ data: result });
  }

  /**
   * Obtener todas las categorías con paginación
   * @param query parámetros de paginación, ordenamiento y filtrado
   * @returns una respuesta con la lista de categorías y la paginación
   */

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    // Ejecutar queries en paralelo cuando sea necesario
    const [list, total] = await Promise.all([
      this.prismaService.categoria.findMany({
        skip,
        take,
        orderBy,
        include: { productos: true },
      }),
      pagination ? this.prismaService.categoria.count() : Promise.resolve(undefined),
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Categoria[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListCategoriaArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, estaActiva, descripcion } = inputDto.where || {};
    const whereInput: Prisma.CategoriaWhereInput = {};

    if (nombre) whereInput.nombre = nombre;
    if (descripcion) whereInput.descripcion = descripcion;
    if (estaActiva !== undefined) whereInput.estaActiva = estaActiva;

    const [list, total] = await Promise.all([
      this.prismaService.categoria.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: { productos: true },
      }),
      this.prismaService.categoria.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<Categoria[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const item = await this.prismaService.categoria.findUnique({
      where: { id },
      include: { productos: true },
    });
    if (!item) return dataResponseError('Categoría no encontrada');
    return dataResponseSuccess<Categoria>({ data: item });
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const exists = await this.prismaService.categoria.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Categoría no encontrada');

    if (updateCategoriaDto.nombre) {
      const nameExists = await this.prismaService.categoria.findFirst({
        where: { nombre: updateCategoriaDto.nombre, id: { not: id } },
        select: { id: true },
      });
      if (nameExists) return dataResponseError('Ya existe una categoría con ese nombre');
    }

    const result = await this.prismaService.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });

    return dataResponseSuccess<Categoria>({ data: result });
  }

  async remove(id: string) {
    // query de categoria, y verificar si existe al menos un producto asociado
    const hasProducts = await this.prismaService.producto.count({
      where: { categoriaId: id },
    });

    if (hasProducts > 0) {
      return dataResponseError('La categoría tiene productos asociados');
    }
    const exists = await this.prismaService.categoria.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Categoría no encontrada');

    await this.prismaService.categoria.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Categoría eliminada' });
  }
}
