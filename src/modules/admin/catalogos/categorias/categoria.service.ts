import { Injectable } from '@nestjs/common';
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
  ListCategoriaArgsDto,
} from './dto/categoria.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Categoria } from './categoria.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class CategoriaService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateCategoriaDto, session: IToken) {
    const exists = await this.prismaService.categoria.findUnique({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (exists) return dataErrorValidations({ nombre: ['La categoría ya existe'] });

    const result = await this.prismaService.categoria.create({
      data: {
        ...inputDto,
        userCreateId: session.usuarioId,
      },
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
      }),
      pagination ? this.prismaService.categoria.count() : undefined,
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
    });
    if (!item) return dataResponseError('Categoría no encontrada');
    return dataResponseSuccess<Categoria>({ data: item });
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto, session: IToken) {
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
      if (nameExists) return dataErrorValidations({ nombre: ['Ya existe una categoría con ese nombre'] });
    }

    const result = await this.prismaService.categoria.update({
      where: { id },
      data: {
        ...updateCategoriaDto,
        userUpdateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<Categoria>({ data: result });
  }

  async remove(id: string) {
    // query de categoria, y verificar si existe al menos un producto asociado
    // const hasProducts = await this.prismaService.producto.count({
    //   where: { categoriaId: id },
    // });

    // if (hasProducts > 0) {
    //   return dataResponseError('La categoría tiene productos asociados');
    // }
    const exists = await this.prismaService.categoria.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Categoría no encontrada');

    await this.prismaService.categoria.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Categoría eliminada' });
  }
}
