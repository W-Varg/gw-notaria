import { Injectable } from '@nestjs/common';
import {
  CreateTransaccionesEgresosDto,
  UpdateTransaccionesEgresosDto,
  ListTransaccionesEgresosArgsDto,
} from './dto/transacciones-egresos.input.dto';
import { PrismaService } from '../../../../global/database/prisma.service';

import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from '../../../../common/dtos/response.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { TransaccionesEgresos } from './transacciones-egresos.entity';
import { paginationParamsFormat } from '../../../../helpers/prisma.helper';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';

@Injectable()
export class TransaccionesEgresosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(inputDto: CreateTransaccionesEgresosDto) {
    // Validar que el gasto existe
    const gastoExists = await this.prismaService.gastos.findUnique({
      where: { id: inputDto.gastoId },
      select: { id: true, montoTotal: true, montoPagado: true },
    });
    if (!gastoExists) return dataErrorValidations({ gastoId: ['El gasto no existe'] });

    // Validar que no se exceda el monto total del gasto
    const nuevoMontoPagado = new Prisma.Decimal(gastoExists.montoPagado).plus(
      new Prisma.Decimal(inputDto.monto),
    );
    if (nuevoMontoPagado.greaterThan(new Prisma.Decimal(gastoExists.montoTotal))) {
      return dataErrorValidations({
        monto: ['El monto de la transacción excede el saldo pendiente del gasto'],
      });
    }

    // Validar cuenta bancaria si se proporciona
    if (inputDto.cuentaBancariaId) {
      const cuentaExists = await this.prismaService.cuentaBancaria.findUnique({
        where: { id: inputDto.cuentaBancariaId },
        select: { id: true },
      });
      if (!cuentaExists)
        return dataErrorValidations({ cuentaBancariaId: ['La cuenta bancaria no existe'] });
    }

    const result = await this.prismaService.transaccionesEgresos.create({
      data: inputDto,
      include: {
        gasto: true,
        cuentaBancaria: true,
      },
    });

    // Actualizar el montoPagado y saldo del gasto
    await this.prismaService.gastos.update({
      where: { id: inputDto.gastoId },
      data: {
        montoPagado: nuevoMontoPagado,
        saldo: new Prisma.Decimal(gastoExists.montoTotal).minus(nuevoMontoPagado),
      },
    });

    return dataResponseSuccess<TransaccionesEgresos>({ data: result });
  }

  async findAll(query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [list, total] = await Promise.all([
      this.prismaService.transaccionesEgresos.findMany({
        skip,
        take,
        orderBy,
        include: {
          gasto: true,
          cuentaBancaria: true,
        },
      }),
      pagination ? this.prismaService.transaccionesEgresos.count() : undefined,
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<TransaccionesEgresos[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListTransaccionesEgresosArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { gastoId, monto, cuentaBancariaId, metodoPago } = inputDto.where || {};
    const whereInput: Prisma.TransaccionesEgresosWhereInput = {};

    if (gastoId) whereInput.gastoId = gastoId;
    if (monto !== undefined) whereInput.monto = monto;
    if (cuentaBancariaId) whereInput.cuentaBancariaId = cuentaBancariaId;
    if (metodoPago) whereInput.metodoPago = metodoPago;

    const [list, total] = await Promise.all([
      this.prismaService.transaccionesEgresos.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
        include: {
          gasto: true,
          cuentaBancaria: true,
        },
      }),
      this.prismaService.transaccionesEgresos.count({ where: whereInput }),
    ]);

    return dataResponseSuccess<TransaccionesEgresos[]>({
      data: list,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.transaccionesEgresos.findUnique({
      where: { id },
      include: {
        gasto: true,
        cuentaBancaria: true,
      },
    });
    if (!item) return dataResponseError('Transacción de egreso no encontrada');
    return dataResponseSuccess<TransaccionesEgresos>({ data: item });
  }

  async update(id: number, updateDto: UpdateTransaccionesEgresosDto) {
    const exists = await this.prismaService.transaccionesEgresos.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Transacción de egreso no encontrada');

    // Validar gasto si se actualiza
    if (updateDto.gastoId) {
      const gastoExists = await this.prismaService.gastos.findUnique({
        where: { id: updateDto.gastoId },
        select: { id: true },
      });
      if (!gastoExists) return dataResponseError('El gasto no existe');
    }

    // Validar cuenta bancaria si se actualiza
    if (updateDto.cuentaBancariaId) {
      const cuentaExists = await this.prismaService.cuentaBancaria.findUnique({
        where: { id: updateDto.cuentaBancariaId },
        select: { id: true },
      });
      if (!cuentaExists) return dataResponseError('La cuenta bancaria no existe');
    }

    const result = await this.prismaService.transaccionesEgresos.update({
      where: { id },
      data: updateDto,
      include: {
        gasto: true,
        cuentaBancaria: true,
      },
    });

    return dataResponseSuccess<TransaccionesEgresos>({ data: result });
  }

  async remove(id: number) {
    const exists = await this.prismaService.transaccionesEgresos.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return dataResponseError('Transacción de egreso no encontrada');

    await this.prismaService.transaccionesEgresos.delete({ where: { id } });
    return dataResponseSuccess({ data: 'Transacción de egreso eliminada' });
  }
}
