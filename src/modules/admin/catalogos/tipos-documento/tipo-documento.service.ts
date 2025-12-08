import { Injectable } from '@nestjs/common';
import {
  CreateTipoDocumentoDto,
  UpdateTipoDocumentoDto,
  ListTipoDocumentoArgsDto,
} from './dto/tipo-documento.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { TipoDocumento } from './tipo-documento.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class TipoDocumentoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateTipoDocumentoDto, session: IToken) {
    const exists = await this.prismaService.tipoDocumento.findUnique({
      where: { nombre: inputDto.nombre },
      select: { id: true },
    });
    if (exists) return dataResponseError('El tipo de documento ya existe');

    const result = await this.prismaService.tipoDocumento.create({
      data: {
        nombre: inputDto.nombre,
        descripcion: inputDto.descripcion,
        estaActivo: inputDto.estaActivo,
        precioBase: inputDto.precioBase,
        userCreateId: session.usuarioId,
      },
    });
    return dataResponseSuccess<TipoDocumento>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.tipoDocumento.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.tipoDocumento.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<TipoDocumento[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListTipoDocumentoArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, descripcion, precioBase, estaActivo } = inputDto.where || {};
    const whereInput: Prisma.TipoDocumentoWhereInput = {};

    if (nombre) whereInput.nombre = nombre;
    if (descripcion) whereInput.descripcion = descripcion;
    if (precioBase) whereInput.precioBase = precioBase;
    if (estaActivo !== undefined) whereInput.estaActivo = estaActivo;

    const [list, total] = await Promise.all([
      this.prismaService.tipoDocumento.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
      }),
      this.prismaService.tipoDocumento.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<TipoDocumento[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const item = await this.prismaService.tipoDocumento.findUnique({
      where: { id },
    });
    if (!item) return dataResponseError('Tipo de documento no encontrado');
    return dataResponseSuccess<TipoDocumento>({ data: item });
  }

  async update(id: string, updateDto: UpdateTipoDocumentoDto, session: IToken) {
    const exists = await this.prismaService.tipoDocumento.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Tipo de documento no encontrado');

    if (updateDto.nombre) {
      const nameExists = await this.prismaService.tipoDocumento.findFirst({
        where: { nombre: updateDto.nombre, id: { not: id } },
        select: { id: true },
      });
      if (nameExists) return dataResponseError('Ya existe un tipo de documento con ese nombre');
    }

    const result = await this.prismaService.tipoDocumento.update({
      where: { id },
      data: {
        ...updateDto,
        userUpdateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<TipoDocumento>({ data: result });
  }

  async remove(id: string) {
    const exists = await this.prismaService.tipoDocumento.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Tipo de documento no encontrado');

    await this.prismaService.tipoDocumento.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Tipo de documento eliminado' });
  }
}
