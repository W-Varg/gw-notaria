import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearGastos(prisma: PrismaClient, usuarioId: string) {
  const data = [
    {
      nombre: 'Servicios Públicos',
      descripcion: 'Luz, agua y gas del mes',
      proveedor: 'CESSA/AAPOS',
      montoTotal: 1300,
      montoPagado: 1300,
      saldo: 0,
      fechaGasto: new Date('2025-12-05'),
      categoria: 'Servicios',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: null,
    },
    {
      nombre: 'Compra de papelería',
      descripcion: 'Material de oficina mensual',
      proveedor: 'Librería Central',
      montoTotal: 350,
      montoPagado: 350,
      saldo: 0,
      fechaGasto: new Date('2025-12-10'),
      categoria: 'Oficina',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: null,
    },
    {
      nombre: 'Mantenimiento de equipos',
      descripcion: 'Reparación de computadoras y equipos de oficina',
      proveedor: 'TechService SRL',
      montoTotal: 2500,
      montoPagado: 2500,
      saldo: 0,
      fechaGasto: new Date('2025-12-08'),
      categoria: 'Mantenimiento',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: null,
    },
    {
      nombre: 'Publicidad Digital',
      descripcion: 'Campaña en redes sociales',
      proveedor: 'Marketing Pro',
      montoTotal: 2500,
      montoPagado: 2500,
      saldo: 0,
      fechaGasto: new Date('2025-12-15'),
      categoria: 'Marketing',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
    {
      nombre: 'Capacitación del personal',
      descripcion: 'Curso de actualización en normativa notarial',
      proveedor: 'Instituto de Capacitación Legal',
      montoTotal: 1800,
      montoPagado: 1800,
      saldo: 0,
      fechaGasto: new Date('2026-01-03'),
      categoria: 'Capacitación',
      usuarioId: usuarioId,
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
    },
  ];

  const gastosCreados = [];
  for (const gasto of data) {
    const gastoCreado = await prisma.gastos.create({
      data: gasto,
    });
    gastosCreados.push(gastoCreado);
  }

  console.info(`Created ${data.length} gastos`);
  
  return gastosCreados;
}
