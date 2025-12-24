import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
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

    let gastos = [];

    if (!filtro.bancoId) {
      gastos = await this._prismaService.gastos.findMany({
        where: {
          fechaGasto: fechas.inicio,
        },
      });
    }

    const gastosMov = gastos.map((gasto) => {
      const movimiento: IMovimiento = {
        gastoId: gasto.id,
        fecha: gasto.fechaGasto,
        tipo: 'GASTO',
        concepto: gasto.descripcion,
        referencia: 'RECIBO',
        metodoPago: 'EFECTIVO',
        ingreso: null,
        egreso: gasto.montoPagado,
      };

      return movimiento;
    });

    const totalEgresos = gastosMov.reduce((prev, actual) => {
      return prev.plus(actual.egreso ?? 0);
    }, new Decimal(0));

    const pagosIngresos = await this._prismaService.pagosIngresos.findMany({
      where: {
        fecha: { gte: fechas.inicio, lte: fechas.fin },
        cuentaBancaria: {
          bancoId: filtro.bancoId,
        },
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
    const pagosMov = pagosIngresos.map((ingreso) => {
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

    const totalIngresos = pagosMov.reduce((prev, actual) => {
      return prev.plus(actual.ingreso ?? 0);
    }, new Decimal(0));

    const movimientos: IMovimiento[] = [...gastosMov, ...pagosMov];
    movimientos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    return {
      movimientos,
      totalIngresos,
      totalEgresos,
      saldoFinal: totalIngresos.minus(totalEgresos),
    };
  }
}
