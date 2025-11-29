import { Injectable } from '@nestjs/common';
// import { Prisma, Servicio } from '@prisma/client';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import {
  CreateImagenServicioDto,
  CreateServicioDto,
  ListServiciosArgsDto,
  ServicioWhereInput,
  UpdateServicioDto,
} from './dto/servicios.input.dto';

@Injectable()
export class ServiciosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateServicioDto) {
    const created = await this.prisma.servicio.create({ data: input });
    return dataResponseSuccess({ data: created });
  }

  async findAll(query?: ListFindAllQueryDto) {
    if (!query) {
      // Mantener comportamiento original si no hay query
      const list = await this.prisma.servicio.findMany({ include: { imagenes: true } });
      return dataResponseSuccess({ data: list });
    }

    // Nuevo comportamiento con paginación
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [data, total] = await Promise.all([
      this.prisma.servicio.findMany({
        include: { imagenes: true },
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prisma.servicio.count() : Promise.resolve(0),
    ]);

    if (pagination) {
      return dataResponseSuccess({
        data,
        pagination: { total, page: query.page || 1, size: query.size || 10 },
      });
    }
    return dataResponseSuccess({ data });
  }

  async filter(inputDto: ListServiciosArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto);

    const whereInput = inputDto.where ? this.buildWhereInput(inputDto.where) : {};
    const select = inputDto.select ? this.buildSelect(inputDto.select) : undefined;

    const [list, total] = await Promise.all([
      this.prisma.servicio.findMany({
        where: whereInput,
        // select: { ...select, imagenes: true }
        include: { imagenes: true },
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prisma.servicio.count({ where: whereInput }) : Promise.resolve(0),
    ]);

    return dataResponseSuccess({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  private buildWhereInput(where: ServicioWhereInput) {
    const whereInput: Prisma.ServicioWhereInput = {};

    if (where.nombre) {
      whereInput.nombre = where.nombre;
    }
    if (where.descripcion) {
      whereInput.descripcion = where.descripcion;
    }
    if (where.categoria) {
      whereInput.categoria = where.categoria;
    }
    if (where.estaActivo !== undefined) {
      whereInput.estaActivo = where.estaActivo;
    }
    if (where.precio) {
      whereInput.precio = where.precio;
    }

    return whereInput;
  }

  private buildSelect(select: string[]) {
    const selectInput: any = {};

    select.forEach((field) => {
      if (
        [
          'id',
          'nombre',
          'descripcion',
          'categoria',
          'precio',
          'duracion',
          'estaActivo',
          'fechaCreacion',
          'fechaActualizacion',
        ].includes(field)
      ) {
        selectInput[field] = true;
      }
    });

    return selectInput;
  }

  async findOne(id: string) {
    const item = await this.prisma.servicio.findUnique({
      where: { id },
      include: { imagenes: true },
    });
    if (!item) return dataResponseError('Servicio no encontrado');
    return dataResponseSuccess({ data: item });
  }

  async update(id: string, input: UpdateServicioDto) {
    const exists = await this.prisma.servicio.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return dataResponseError('Servicio no encontrado');
    const updated = await this.prisma.servicio.update({ where: { id }, data: input });
    return dataResponseSuccess({ data: updated });
  }

  async remove(id: string) {
    // Verificar si el servicio tiene imágenes asociadas
    // const hasImages = await this.prisma.imagenServicio.count({ where: { servicioId: id } });

    // if (hasImages > 0) {
    //   return dataResponseError('El servicio tiene imágenes asociadas');
    // }

    const exists = await this.prisma.servicio.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return dataResponseError('Servicio no encontrado');
    await this.prisma.servicio.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Servicio eliminado' });
  }

  /* ---------------------------- Gestión de imágenes ---------------------------- */
  async addImagen(input: CreateImagenServicioDto) {
    const serv = await this.prisma.servicio.findUnique({
      where: { id: input.servicioId },
      select: { id: true },
    });
    if (!serv) return dataResponseError('Servicio no encontrado');
    const created = await this.prisma.imagenServicio.create({ data: { ...input } as any });
    if (input.esPrincipal) {
      await this.prisma.imagenServicio.updateMany({
        where: { servicioId: input.servicioId, id: { not: created.id } },
        data: { esPrincipal: false },
      });
    }
    return dataResponseSuccess({ data: created });
  }

  async removeImagen(imagenId: string) {
    const exists = await this.prisma.imagenServicio.findUnique({
      where: { id: imagenId },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Imagen no encontrada');
    await this.prisma.imagenServicio.delete({ where: { id: imagenId } });
    return dataResponseSuccess({ data: 'Imagen eliminada' });
  }
}
