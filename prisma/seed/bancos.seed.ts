import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearBancos(prisma: PrismaClient, usuarioId: string) {
  const data = [
    {
      nombre: 'Banco Unión S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Nacional de Bolivia S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Mercantil Santa Cruz S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco de Crédito de Bolivia S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Económico S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco FIE S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Ganadero S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco PYME de la Comunidad S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Fortaleza S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Prodem S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Sol S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
    {
      nombre: 'Banco Bisa S.A.',
      userCreateId: usuarioId,
      userUpdateId: usuarioId,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    },
  ];

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "cat_bancos"
    RESTART IDENTITY
    CASCADE;
  `);

  const result = await prisma.banco.createManyAndReturn({
    data,
  });

  console.info(`Created ${data.length} bancos`);

  return result.map((v) => v.id);
}
