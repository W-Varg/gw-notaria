import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { CreateHorarioDto, UpdateHorarioDto, ListHorarioArgsDto } from './dto/horarios.input.dto';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';

@Injectable()
export class HorariosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateHorarioDto) {
    const exists = await this.prismaService.horarioAtencion.findUnique({
      where: {
        sucursalId_diaSemana: { sucursalId: inputDto.sucursalId, diaSemana: inputDto.diaSemana },
      },
      select: { id: true },
    });
    if (exists) return dataResponseError('Ya existe horario para ese día en la sucursal');

    const result = await this.prismaService.horarioAtencion.create({ data: inputDto });
    return dataResponseSuccess({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.horarioAtencion.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.horarioAtencion.count() : Promise.resolve(0),
    ]);

    if (pagination) {
      return dataResponseSuccess({
        data: list,
        pagination: { total, page: query.page || 1, size: query.size || 10 },
      });
    }
    return dataResponseSuccess({ data: list });
  }

  async filter(inputDto: ListHorarioArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto);

    const whereInput = this.buildWhereInput(inputDto.where);
    const select = inputDto.select ? this.buildSelect(inputDto.select) : undefined;

    const [list, total] = await Promise.all([
      this.prismaService.horarioAtencion.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        select,
      }),
      pagination
        ? this.prismaService.horarioAtencion.count({ where: whereInput })
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

  private buildWhereInput(where?: any): Prisma.HorarioAtencionWhereInput {
    if (!where) return {};

    const whereInput: Prisma.HorarioAtencionWhereInput = {};

    if (where.sucursalId) {
      whereInput.sucursalId = where.sucursalId;
    }

    if (where.diaSemana) {
      whereInput.diaSemana = where.diaSemana;
    }

    if (where.estaActivo !== undefined) {
      whereInput.estaActivo = where.estaActivo;
    }

    return whereInput;
  }

  private buildSelect(select: any): Prisma.HorarioAtencionSelect {
    const defaultSelect: Prisma.HorarioAtencionSelect = {
      id: true,
      sucursalId: true,
      diaSemana: true,
      horaApertura: true,
      horaCierre: true,
      estaActivo: true,
    };

    if (!select) return defaultSelect;

    return {
      id: select.id !== false,
      sucursalId: select.sucursalId !== false,
      diaSemana: select.diaSemana !== false,
      horaApertura: select.horaApertura !== false,
      horaCierre: select.horaCierre !== false,
      estaActivo: select.estaActivo !== false,
    };
  }

  async findOne(id: string) {
    const item = await this.prismaService.horarioAtencion.findUnique({ where: { id } });
    if (!item) return dataResponseError('Horario no encontrado');
    return dataResponseSuccess({ data: item });
  }

  async update(id: string, inputDto: UpdateHorarioDto) {
    const exists = await this.prismaService.horarioAtencion.findUnique({
      where: { id },
      select: { id: true, sucursalId: true, diaSemana: true },
    });
    if (!exists) return dataResponseError('Horario no encontrado');

    if (inputDto.diaSemana) {
      const duplicate = await this.prismaService.horarioAtencion.findFirst({
        where: { sucursalId: exists.sucursalId, diaSemana: inputDto.diaSemana, id: { not: id } },
        select: { id: true },
      });
      if (duplicate) return dataResponseError('Ya existe horario para ese día en la sucursal');
    }

    const result = await this.prismaService.horarioAtencion.update({
      where: { id },
      data: inputDto,
    });
    return dataResponseSuccess({ data: result });
  }

  async remove(id: string) {
    const exists = await this.prismaService.horarioAtencion.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Horario no encontrado');
    await this.prismaService.horarioAtencion.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Horario eliminado' });
  }
}
