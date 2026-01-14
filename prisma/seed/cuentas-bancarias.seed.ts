import { PrismaClient } from '../../src/generated/prisma/client';
import { randomFromArray } from './seed';

export async function crearCuentasBancarias(
  prisma: PrismaClient,
  usuarioId: string,
  bancoIds: number[],
) {
  const data = [
    {
      bancoId: randomFromArray(bancoIds),
      numeroCuenta: '100-001-000001',
      tipoCuenta: 'CAJA DE AHORRO',
      saldoActual: 15000.5,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
    {
      bancoId: randomFromArray(bancoIds),
      numeroCuenta: '100-001-000002',
      tipoCuenta: 'CUENTA CORRIENTE',
      saldoActual: 32000,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
    {
      bancoId: randomFromArray(bancoIds),
      numeroCuenta: '200-010-000001',
      tipoCuenta: 'CAJA DE AHORRO',
      saldoActual: 8500.75,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
    {
      bancoId: randomFromArray(bancoIds),
      numeroCuenta: '300-020-000001',
      tipoCuenta: 'CUENTA CORRIENTE',
      saldoActual: 120000,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
    {
      bancoId: randomFromArray(bancoIds),
      numeroCuenta: '400-030-000001',
      tipoCuenta: 'CAJA DE AHORRO',
      saldoActual: 5600,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
    {
      bancoId: randomFromArray(bancoIds),
      numeroCuenta: '500-040-000001',
      tipoCuenta: 'CAJA DE AHORRO',
      saldoActual: 9800.3,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
  ];

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "cont_cuentas_bancarias"
    RESTART IDENTITY
    CASCADE;
  `);

  const result = await prisma.cuentaBancaria.createManyAndReturn({
    data,
  });

  console.info(`Created ${data.length} cuentas bancarias`);

  return result.map((v) => v.id);
}
