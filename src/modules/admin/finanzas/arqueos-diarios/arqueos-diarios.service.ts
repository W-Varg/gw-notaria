import { Injectable } from '@nestjs/common';
import {
  CreateArqueosDiariosDto,
  UpdateArqueosDiariosDto,
  ListArqueosDiariosArgsDto,
} from './dto/arqueos-diarios.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';

import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { ArqueosDiarios } from './arqueos-diarios.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { IToken } from '../../../../common/decorators/token.decorator';

@Injectable()
export class ArqueosDiariosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateArqueosDiariosDto, session: IToken) {
    // Validar que no exista un arqueo para la misma fecha
    const exists = await this.prismaService.arqueosDiarios.findUnique({
      where: { fecha: new Date(inputDto.fecha) },
      select: { id: true },
    });
    if (exists) return dataErrorValidations({ fecha: ['Ya existe un arqueo para esta fecha'] });

    // Validar usuario de cierre si se proporciona
    if (inputDto.usuarioCierreId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: inputDto.usuarioCierreId },
        select: { id: true },
      });
      if (!usuarioExists)
        return dataErrorValidations({ usuarioCierreId: ['El usuario de cierre no existe'] });
    }

    const result = await this.prismaService.arqueosDiarios.create({
      data: {
        ...inputDto,
        usuarioCierreId: inputDto.usuarioCierreId || session.usuarioId,
      },
      include: {
        usuarioCierre: true,
      },
    });

    return dataResponseSuccess<ArqueosDiarios>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.arqueosDiarios.findMany({
        skip,
        take,
        orderBy,
        include: {
          usuarioCierre: true,
        },
      }),
      pagination ? this.prismaService.arqueosDiarios.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<ArqueosDiarios[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListArqueosDiariosArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const {
      fecha,
      usuarioCierreId,
      totalIngresosEfectivo,
      totalIngresosBancos,
      totalEgresosEfectivo,
      totalEgresosBancos,
      saldoFinalDia,
      fechaCierre,
    } = inputDto.where || {};
    const whereInput: Prisma.ArqueosDiariosWhereInput = {};

    if (fecha) whereInput.fecha = fecha;
    if (fechaCierre) whereInput.fechaCierre = fechaCierre;
    if (usuarioCierreId) whereInput.usuarioCierreId = usuarioCierreId;
    if (totalIngresosEfectivo !== undefined)
      whereInput.totalIngresosEfectivo = totalIngresosEfectivo;
    if (totalIngresosBancos !== undefined) whereInput.totalIngresosBancos = totalIngresosBancos;
    if (totalEgresosEfectivo !== undefined) whereInput.totalEgresosEfectivo = totalEgresosEfectivo;
    if (totalEgresosBancos !== undefined) whereInput.totalEgresosBancos = totalEgresosBancos;
    if (saldoFinalDia !== undefined) whereInput.saldoFinalDia = saldoFinalDia;

    const [list, total] = await Promise.all([
      this.prismaService.arqueosDiarios.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          usuarioCierre: true,
        },
      }),
      this.prismaService.arqueosDiarios.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<ArqueosDiarios[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.arqueosDiarios.findUnique({
      where: { id },
      include: {
        usuarioCierre: true,
      },
    });
    if (!item) return dataResponseError('Arqueo diario no encontrado');
    return dataResponseSuccess<ArqueosDiarios>({ data: item });
  }

  async update(id: number, updateDto: UpdateArqueosDiariosDto, session: IToken) {
    const exists = await this.prismaService.arqueosDiarios.findUnique({
      where: { id },
      select: { id: true, fecha: true },
    });
    if (!exists) return dataResponseError('Arqueo diario no encontrado');

    // Validar fecha única si se actualiza
    if (updateDto.fecha) {
      const fechaDup = await this.prismaService.arqueosDiarios.findFirst({
        where: {
          fecha: new Date(updateDto.fecha),
          NOT: { id },
        },
        select: { id: true },
      });
      if (fechaDup) return dataResponseError('Ya existe un arqueo para esta fecha');
    }

    // Validar usuario de cierre si se actualiza
    if (updateDto.usuarioCierreId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: updateDto.usuarioCierreId },
        select: { id: true },
      });
      if (!usuarioExists) return dataResponseError('El usuario de cierre no existe');
    }

    const result = await this.prismaService.arqueosDiarios.update({
      where: { id },
      data: updateDto,
      include: {
        usuarioCierre: true,
      },
    });

    return dataResponseSuccess<ArqueosDiarios>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.arqueosDiarios.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Arqueo diario no encontrado');

    await this.prismaService.arqueosDiarios.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Arqueo diario eliminado' });
  }
}
