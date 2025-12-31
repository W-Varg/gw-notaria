import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearGastos(prisma: PrismaClient, usuarioId: string) {
  const data = [
    {
      id: 6,
      nombre: 'Compra de papelería',
      descripcion: 'Material de oficina mensual',
      proveedor: 'Librería Central',
      montoTotal: '350',
      montoPagado: '350',
      saldo: '0',
      fechaGasto: '2025-12-17T00:00:00.000Z',
      categoria: 'Oficina',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: null,
    },
    {
      id: 7,
      nombre: 'Servicio de internet',
      descripcion: 'Pago mensual de internet',
      proveedor: 'ENTEL',
      montoTotal: '500',
      montoPagado: '300',
      saldo: '200',
      fechaGasto: '2025-12-17T00:00:00.000Z',
      categoria: 'Servicios',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
    {
      id: 8,
      nombre: 'Mantenimiento de equipos',
      descripcion: 'Reparación de impresora',
      proveedor: 'TechService SRL',
      montoTotal: '1200',
      montoPagado: '0',
      saldo: '1200',
      fechaGasto: '2025-12-17T00:00:00.000Z',
      categoria: 'Mantenimiento',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: null,
    },
    {
      id: 9,
      nombre: 'Compra de combustible',
      descripcion: 'Combustible para vehículo institucional',
      proveedor: 'YPFB',
      montoTotal: '800',
      montoPagado: '800',
      saldo: '0',
      fechaGasto: '2025-12-17T00:00:00.000Z',
      categoria: 'Transporte',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: null,
    },
    {
      id: 10,
      nombre: 'Capacitación',
      descripcion: 'Curso de actualización técnica',
      proveedor: 'Academia Dev',
      montoTotal: '1500',
      montoPagado: '500',
      saldo: '1000',
      fechaGasto: '2025-12-17T00:00:00.000Z',
      categoria: 'Capacitación',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
  ];

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "gastos"
    RESTART IDENTITY
    CASCADE;
  `);

  const result = await prisma.gastos.createManyAndReturn({
    data,
  });

  console.info(`Created ${data.length} gastos`);

  return result.map((v) => v.id);
}
