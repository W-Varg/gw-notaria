import { PrismaClient } from '../../src/generated/prisma/client';

export async function CatalogoServiciosSeed(prisma: PrismaClient) {
  await prisma.catalogoServicio.createMany({
    data: [
      {
        id: 'ckr9x8v9m0001x2kz8p4h1a',
        codigo: '691001',
        nombre: 'Autenticación de firmas',
        descripcion: 'Autenticación de firmas de documentos notariales',
        precioBase: 50,
        tarifaVariable: false,
        activo: true,
        userCreateId: 'admin',
      },
      {
        id: 'ckr9x8v9m0002x2kz8p4h1b',
        codigo: '691002',
        nombre: 'Poder notarial',
        descripcion: 'Redacción y certificación de poder notarial',
        precioBase: 150,
        tarifaVariable: false,
        activo: true,
        userCreateId: 'admin',
      },
      {
        id: 'ckr9x8v9m0003x2kz8p4h1c',
        codigo: '692000',
        nombre: 'Elaboración de contratos',
        descripcion: 'Redacción de contratos civiles y comerciales',
        precioBase: 200,
        tarifaVariable: false,
        activo: true,
        userCreateId: 'admin',
      },
      {
        id: 'ckr9x8v9m0004x2kz8p4h1d',
        codigo: '693000',
        nombre: 'Asesoría contable',
        descripcion: 'Revisión y elaboración de estados financieros',
        precioBase: 300,
        tarifaVariable: false,
        activo: true,
        userCreateId: 'admin',
      },
      {
        id: 'ckr9x8v9m0005x2kz8p4h1e',
        codigo: '694001',
        nombre: 'Legalización de documentos',
        descripcion: 'Legalización de documentos oficiales ante instituciones',
        precioBase: 75,
        tarifaVariable: false,
        activo: true,
        userCreateId: 'admin',
      },
    ],
    skipDuplicates: true, // evita errores si ya existen
  });

  console.log('Seed de catalogo_servicio completado!');
}