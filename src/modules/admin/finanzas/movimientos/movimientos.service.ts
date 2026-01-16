import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../global/database/prisma.service';
import { IMovimiento } from './interfaces/imovimiento';
import { Decimal } from '@prisma/client/runtime/client';
import { FiltroInputDto } from './dto/filtro.input.dto';
import dayjs from 'dayjs';

@Injectable()
export class MovimientosService {
  constructor(private readonly _prismaService: PrismaService) {}

  async get(filtro?: FiltroInputDto) {
    const fecha = filtro?.fecha ? dayjs(filtro?.fecha) : undefined;

    const fechas = {
      inicio: fecha?.startOf('day').toDate(),
      fin: fecha?.endOf('day').toDate(),
    };

    const transaccionesEgresos = await this._prismaService.transaccionesEgresos.findMany({
      where: {
        fecha: { gte: fechas.inicio, lte: fechas.fin },
        cuentaBancaria: filtro.bancoId
          ? {
              bancoId: filtro.bancoId,
            }
          : undefined,
      },
      include: {
        gasto: true,
        cuentaBancaria: {
          select: {
            banco: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    const gastosMov = transaccionesEgresos.map((egreso) => {
      const movimiento: IMovimiento = {
        gastoId: egreso.id,
        fecha: egreso.fecha,
        tipo: 'GASTO',
        concepto: egreso.gasto?.descripcion,
        metodoPago: egreso.metodoPago,
        ingreso: null,
        egreso: egreso.monto,
        banco: egreso?.cuentaBancaria?.banco,
      };

      return movimiento;
    });

    const { totalEgresosEfectivo, totalEgresosBancos } = gastosMov.reduce(
      (prev, actual) => {
        if (actual.banco)
          prev.totalEgresosBancos = prev.totalEgresosBancos.plus(actual.egreso ?? 0);
        else prev.totalEgresosEfectivo = prev.totalEgresosEfectivo.plus(actual.egreso ?? 0);

        return prev;
      },
      { totalEgresosEfectivo: new Decimal(0), totalEgresosBancos: new Decimal(0) },
    );

    const ingresos = await this._prismaService.pagosIngresos.findMany({
      where: {
        fecha: { gte: fechas.inicio, lte: fechas.fin },
        cuentaBancaria: filtro.bancoId
          ? {
              bancoId: filtro.bancoId,
            }
          : undefined,
      },
      include: {
        cuentaBancaria: {
          select: {
            banco: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });
    const ingresosMov = ingresos.map((ingreso) => {
      const movimiento: IMovimiento = {
        ingresoId: ingreso.id,
        fecha: ingreso.fecha,
        tipo: 'INGRESO',
        concepto: ingreso.concepto,
        referencia: ingreso.constanciaTipo,
        metodoPago: ingreso.tipoPago,
        ingreso: ingreso.monto,
        banco: ingreso?.cuentaBancaria?.banco,
        egreso: null,
      };

      return movimiento;
    });

    const { totalIngresosEfectivo, totalIngresosBancos } = ingresosMov.reduce(
      (prev, actual) => {
        if (actual.banco)
          prev.totalIngresosBancos = prev.totalIngresosBancos.plus(actual.ingreso ?? 0);
        else prev.totalIngresosEfectivo = prev.totalIngresosEfectivo.plus(actual.ingreso ?? 0);

        return prev;
      },
      { totalIngresosEfectivo: new Decimal(0), totalIngresosBancos: new Decimal(0) },
    );

    const movimientos: IMovimiento[] = [...gastosMov, ...ingresosMov];
    movimientos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    return {
      movimientos,
      totalIngresosEfectivo,
      totalIngresosBancos,
      totalEgresosBancos,
      totalEgresosEfectivo,
      saldoFinal: totalIngresosEfectivo
        .plus(totalIngresosBancos)
        .minus(totalEgresosEfectivo)
        .minus(totalEgresosBancos),
    };
  }
}
