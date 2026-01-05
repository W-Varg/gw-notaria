import { Injectable } from '@nestjs/common';
import {
  CreatePlantillaDocumentoDto,
  UpdatePlantillaDocumentoDto,
  ListPlantillaDocumentoArgsDto,
} from './dto/plantilla-documento.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { PlantillaDocumento } from './plantilla-documento.entity';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { IToken } from 'src/common/decorators/token.decorator';

@Injectable()
export class PlantillaDocumentoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreatePlantillaDocumentoDto, session: IToken) {
    const tipoDocExists = await this.prismaService.tipoDocumento.findUnique({
      where: { id: inputDto.tipoDocumentoId },
      select: { id: true },
    });
    if (!tipoDocExists)
      return dataErrorValidations({ tipoDocumentoId: ['El tipo de documento no existe'] });

    const exists = await this.prismaService.plantillaDocumento.findFirst({
      where: {
        tipoDocumentoId: inputDto.tipoDocumentoId,
        nombrePlantilla: inputDto.nombrePlantilla,
      },
      select: { id: true },
    });
    if (exists)
      return dataErrorValidations({
        nombrePlantilla: ['Ya existe una plantilla con ese nombre para este tipo'],
      });

    const result = await this.prismaService.plantillaDocumento.create({
      data: {
        ...inputDto,
        userCreateId: session.usuarioId,
      },
    });
    return dataResponseSuccess<PlantillaDocumento>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.plantillaDocumento.findMany({
        skip,
        take,
        orderBy,
        include: {
          tipoDocumento: true,
        },
      }),
      pagination ? this.prismaService.plantillaDocumento.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<PlantillaDocumento[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListPlantillaDocumentoArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { tipoDocumentoId, nombrePlantilla, descripcion, estaActiva } = inputDto.where || {};
    const whereInput: Prisma.PlantillaDocumentoWhereInput = {};

    if (tipoDocumentoId) whereInput.tipoDocumentoId = tipoDocumentoId;
    if (nombrePlantilla) whereInput.nombrePlantilla = nombrePlantilla;
    if (descripcion) whereInput.descripcion = descripcion;
    if (estaActiva !== undefined) whereInput.estaActiva = estaActiva;

    const [list, total] = await Promise.all([
      this.prismaService.plantillaDocumento.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          tipoDocumento: true,
        },
      }),
      this.prismaService.plantillaDocumento.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<PlantillaDocumento[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.plantillaDocumento.findUnique({
      where: { id },
      include: {
        tipoDocumento: true,
      },
    });
    if (!item) return dataResponseError('Plantilla de documento no encontrada');
    return dataResponseSuccess<PlantillaDocumento>({ data: item });
  }

  async update(id: number, updateDto: UpdatePlantillaDocumentoDto, session: IToken) {
    const exists = await this.prismaService.plantillaDocumento.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Plantilla de documento no encontrada');

    if (updateDto.tipoDocumentoId) {
      const tipoDocExists = await this.prismaService.tipoDocumento.findUnique({
        where: { id: updateDto.tipoDocumentoId },
        select: { id: true },
      });
      if (!tipoDocExists)
        return dataErrorValidations({ tipoDocumentoId: ['El tipo de documento no existe'] });
    }

    const result = await this.prismaService.plantillaDocumento.update({
      where: { id },
      data: {
        ...updateDto,
        userUpdateId: session.usuarioId,
      },
    });

    return dataResponseSuccess<PlantillaDocumento>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.plantillaDocumento.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Plantilla de documento no encontrada');

    await this.prismaService.plantillaDocumento.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Plantilla de documento eliminada' });
  }
}
