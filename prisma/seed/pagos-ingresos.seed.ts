import { ConstanciaEnum, PrismaClient } from '../../src/generated/prisma/client';
import { MetodoPagoEnum } from '../../src/enums/metodo-pago.enum';

export async function crearPagosIngresos(prisma: PrismaClient, usuarioId: string) {
  const data = [
  {
    fecha: new Date(),
    monto: 150.0,
    tipoPago: MetodoPagoEnum.EFECTIVO,
    cuentaBancariaId: null,
    constanciaTipo: ConstanciaEnum.RECIBO,
    numeroConstancia: 'REC-0001',
    concepto: 'Pago inicial en efectivo',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 200.0,
    tipoPago: MetodoPagoEnum.QR,
    cuentaBancariaId: null,
    constanciaTipo: ConstanciaEnum.FACTURA,
    numeroConstancia: 'QR-10234',
    concepto: 'Pago vía código QR',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 500.0,
    tipoPago: MetodoPagoEnum.TRANSFERENCIA,
    cuentaBancariaId: null,
    constanciaTipo: ConstanciaEnum.FACTURA,
    numeroConstancia: 'TRF-55821',
    concepto: 'Transferencia bancaria',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 1000.0,
    tipoPago: MetodoPagoEnum.CHEQUE,
    cuentaBancariaId: null,
    constanciaTipo: ConstanciaEnum.RECIBO,
    numeroConstancia: 'CHQ-88991',
    concepto: 'Pago mediante cheque',
    usuarioRegistroId: usuarioId,
  },
  {
    fecha: new Date(),
    monto: 800.0,
    tipoPago: MetodoPagoEnum.DEPOSITO,
    cuentaBancariaId: null,
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
