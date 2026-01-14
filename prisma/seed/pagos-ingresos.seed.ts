import { METODO_PAGO } from 'src/modules/admin/finanzas/pagos-ingresos/constants/metodo-pago.const';
import { ConstanciaEnum, PrismaClient } from '../../src/generated/prisma/client';
import { randomFromArray } from './seed';

export async function crearPagosIngresos(prisma: PrismaClient, usuarioId: string, cuentaIds: number[]) {
  const data = [
  {
    fecha: new Date(),
    monto: 150,
    tipoPago: METODO_PAGO.EFECTIVO,
    cuentaBancariaId: randomFromArray(cuentaIds),
    constanciaTipo: ConstanciaEnum.RECIBO,
    numeroConstancia: 'REC-0001',
    concepto: 'Pago inicial en efectivo',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 200,
    tipoPago: METODO_PAGO.QR,
    cuentaBancariaId: randomFromArray(cuentaIds),
    constanciaTipo: ConstanciaEnum.FACTURA,
    numeroConstancia: 'QR-10234',
    concepto: 'Pago vía código QR',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 500,
    tipoPago: METODO_PAGO.TRANSFERENCIA,
    cuentaBancariaId: randomFromArray(cuentaIds),
    constanciaTipo: ConstanciaEnum.FACTURA,
    numeroConstancia: 'TRF-55821',
    concepto: 'Transferencia bancaria',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 1000,
    tipoPago: METODO_PAGO.CHEQUE,
    cuentaBancariaId: randomFromArray(cuentaIds),
    constanciaTipo: ConstanciaEnum.RECIBO,
    numeroConstancia: 'CHQ-88991',
    concepto: 'Pago mediante cheque',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 800,
    tipoPago: METODO_PAGO.DEPOSITO,
    cuentaBancariaId: randomFromArray(cuentaIds),
    constanciaTipo: ConstanciaEnum.RECIBO,
    numeroConstancia: 'DEP-44321',
    concepto: 'Depósito bancario',
    usuarioRegistroId: usuarioId,
  },
];

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "cont_pagos_ingresos"
    RESTART IDENTITY
    CASCADE;
  `);

  await prisma.pagosIngresos.createMany({
    data,
  });

  console.info(`Created ${data.length} pagosIngresos`);
}
