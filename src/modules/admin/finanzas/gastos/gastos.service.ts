import { Injectable } from '@nestjs/common';
import { CreateGastosDto, UpdateGastosDto, ListGastosArgsDto } from './dto/gastos.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { Gastos } from './gastos.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { IToken } from '../../../../common/decorators/token.decorator';

@Injectable()
export class GastosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateGastosDto, session: IToken) {
    // Validar usuario si se proporciona
    if (inputDto.usuarioId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: inputDto.usuarioId },
        select: { id: true },
      });
      if (!usuarioExists) return dataErrorValidations({ usuarioId: ['El usuario no existe'] });
    }

    // Calcular saldo
    const montoPagado = inputDto.montoPagado ?? 0;
    const saldo = new Prisma.Decimal(inputDto.montoTotal).minus(new Prisma.Decimal(montoPagado));

    const result = await this.prismaService.gastos.create({
      data: {
        ...inputDto,
        montoPagado: montoPagado,
        saldo,
        userCreateId: session.usuarioId,
      },
      include: {
        usuario: true,
      },
    });

    return dataResponseSuccess<Gastos>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.gastos.findMany({
        skip,
        take,
        orderBy,
        include: {
          usuario: true,
          transaccionesEgresos: true,
        },
      }),
      pagination ? this.prismaService.gastos.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Gastos[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListGastosArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { nombre, descripcion, proveedor, montoTotal, montoPagado, categoria, usuarioId } =
      inputDto.where || {};
    const whereInput: Prisma.GastosWhereInput = {};

    if (nombre) whereInput.nombre = nombre;
    if (descripcion) whereInput.descripcion = descripcion;
    if (proveedor) whereInput.proveedor = proveedor;
    if (montoTotal !== undefined) whereInput.montoTotal = montoTotal;
    if (montoPagado !== undefined) whereInput.montoPagado = montoPagado;
    if (categoria) whereInput.categoria = categoria;
    if (usuarioId) whereInput.usuarioId = usuarioId;

    const [list, total] = await Promise.all([
      this.prismaService.gastos.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          usuario: true,
          transaccionesEgresos: true,
        },
      }),
      this.prismaService.gastos.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<Gastos[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.gastos.findUnique({
      where: { id },
      include: {
        usuario: true,
        transaccionesEgresos: true,
      },
    });
    if (!item) return dataResponseError('Gasto no encontrado');
    return dataResponseSuccess<Gastos>({ data: item });
  }

  async update(id: number, updateDto: UpdateGastosDto, session: IToken) {
    const exists = await this.prismaService.gastos.findUnique({
      where: { id },
      select: { id: true, montoTotal: true, montoPagado: true },
    });
    if (!exists) return dataResponseError('Gasto no encontrado');

    // Validar usuario si se actualiza
    if (updateDto.usuarioId) {
      const usuarioExists = await this.prismaService.usuario.findUnique({
        where: { id: updateDto.usuarioId },
        select: { id: true },
      });
      if (!usuarioExists) return dataResponseError('El usuario no existe');
    }

    // Calcular nuevo saldo si cambia montoTotal o montoPagado
    let saldo: Prisma.Decimal | undefined;
    if (updateDto.montoTotal !== undefined || updateDto.montoPagado !== undefined) {
      const nuevoMontoTotal = updateDto.montoTotal ?? exists.montoTotal;
      const nuevoMontoPagado = updateDto.montoPagado ?? exists.montoPagado;
      saldo = new Prisma.Decimal(nuevoMontoTotal).minus(new Prisma.Decimal(nuevoMontoPagado));
    }

    const result = await this.prismaService.gastos.update({
      where: { id },
      data: {
        ...updateDto,
        ...(saldo !== undefined && { saldo }),
        userUpdateId: session.usuarioId,
      },
      include: {
        usuario: true,
      },
    });

    return dataResponseSuccess<Gastos>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.gastos.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Gasto no encontrado');

    await this.prismaService.gastos.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Gasto eliminado' });
  }
}
