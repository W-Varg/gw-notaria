import { METODO_PAGO } from 'src/modules/admin/finanzas/pagos-ingresos/constants/metodo-pago.const';
import { PrismaClient } from '../../src/generated/prisma/client';
import { randomFromArray } from './seed';

export async function crearTransaccionesEgresos(
  prisma: PrismaClient,
  gastoIds: number[],
  cuentaBancariaIds: number[],
) {
  const data = [
    {
      gastoId: randomFromArray(gastoIds),
      monto: 150.5,
      fecha: new Date('2025-01-05'),
      cuentaBancariaId: randomFromArray(cuentaBancariaIds),
      metodoPago: METODO_PAGO.EFECTIVO,
    },
    {
      gastoId: randomFromArray(gastoIds),
      monto: 980,
      fecha: new Date('2025-01-08'),
      cuentaBancariaId: randomFromArray(cuentaBancariaIds),
      metodoPago: METODO_PAGO.TRANSFERENCIA,
    },
    {
      gastoId: randomFromArray(gastoIds),
      monto: 320.75,
      fecha: new Date('2025-01-10'),
      cuentaBancariaId: randomFromArray(cuentaBancariaIds),
      metodoPago: METODO_PAGO.QR,
    },
    {
      gastoId: randomFromArray(gastoIds),
      monto: 2100,
      fecha: new Date('2025-01-12'),
      cuentaBancariaId: randomFromArray(cuentaBancariaIds),
      metodoPago: METODO_PAGO.DEPOSITO,
    },
    {
      gastoId: randomFromArray(gastoIds),
      monto: 450.25,
      fecha: new Date('2025-01-15'),
      cuentaBancariaId: randomFromArray(cuentaBancariaIds),
      metodoPago: METODO_PAGO.TRANSFERENCIA,
    },
  ];

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "cont_transacciones_egresos"
    RESTART IDENTITY
    CASCADE;
  `);

  await prisma.transaccionesEgresos.createMany({
    data,
  });

  console.info(`Created ${data.length} transacciones egresos`);
}
