import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearComercializadoras(
  prisma: PrismaClient,
  adminUserId: string,
  clientes: any[],
  sucursales: any[],
) {
  console.info('Creando comercializadoras...');

  const comercializadora1 = await prisma.comercializadora.create({
    data: {
      // nombre: 'Urbanización Los Pinos',
      tipoComercializadora: 1, // techo
      metaData: {
        proyectoUrb: 'Los Pinos Fase 1',
        mza: 'A',
        proy: 'LP-2026-001',
        lote: '10',
        fechaRecepcion: '2026-01-05',
      },
      sucursalId: sucursales[0]?.id,
      clienteId: clientes[0].id, // Persona Natural
      consolidado: false,
      minuta: 'MIN-2026-001',
      protocolo: 'PROT-2026-001',
      fechaEnvio: new Date('2026-01-06'),
      fechaEnvioTestimonio: new Date('2026-01-08'),
      userCreateId: adminUserId,
    },
  });

  const comercializadora2 = await prisma.comercializadora.create({
    data: {
      // nombre: 'Residencial Monumental Valle Alto',
      tipoComercializadora: 2, // monumental
      metaData: {
        proyectoUrb: 'Valle Alto Premium',
        mza: 'B',
        proy: 'VA-2026-002',
        lote: '25',
        fechaRecepcion: '2026-01-03',
        superficieTerreno: '500 m2',
        superficieConstruccion: '350 m2',
      },
      sucursalId: sucursales[1]?.id,
      clienteId: clientes[3].id, // Persona Jurídica
      consolidado: true,
      minuta: 'MIN-2026-002',
      protocolo: 'PROT-2026-002',
      fechaEnvio: new Date('2026-01-04'),
      fechaEnvioTestimonio: new Date('2026-01-07'),
      userCreateId: adminUserId,
    },
  });

  const comercializadora3 = await prisma.comercializadora.create({
    data: {
      // nombre: 'Condominio Santa Rita',
      tipoComercializadora: 1, // techo
      metaData: {
        proyectoUrb: 'Santa Rita Residencial',
        mza: 'C',
        proy: 'SR-2026-003',
        lote: '15',
        fechaRecepcion: '2026-01-07',
        torre: 'A',
        piso: '3',
        departamento: '3B',
      },
      sucursalId: sucursales[0]?.id,
      clienteId: clientes[1].id, // Persona Natural
      consolidado: false,
      minuta: 'MIN-2026-003',
      protocolo: null,
      fechaEnvio: new Date('2026-01-08'),
      fechaEnvioTestimonio: null,
      userCreateId: adminUserId,
    },
  });

  const comercializadora4 = await prisma.comercializadora.create({
    data: {
      // nombre: 'Urbanización El Dorado',
      tipoComercializadora: 2, // monumental
      metaData: {
        proyectoUrb: 'El Dorado Elite',
        mza: 'D',
        proy: 'ED-2026-004',
        lote: '8',
        fechaRecepcion: '2026-01-02',
        zona: 'Norte',
      },
      sucursalId: sucursales[0]?.id,
      clienteId: clientes[4].id, // Persona Jurídica
      consolidado: true,
      minuta: 'MIN-2026-004',
      protocolo: 'PROT-2026-004',
      fechaEnvio: new Date('2026-01-03'),
      fechaEnvioTestimonio: new Date('2026-01-06'),
      userCreateId: adminUserId,
    },
  });

  const comercializadora5 = await prisma.comercializadora.create({
    data: {
      // nombre: 'Proyecto Las Magnolias',
      tipoComercializadora: 1, // techo
      metaData: {
        proyectoUrb: 'Las Magnolias',
        mza: 'E',
        proy: 'LM-2026-005',
        lote: '32',
        fechaRecepcion: '2026-01-04',
      },
      sucursalId: sucursales[1]?.id,
      clienteId: clientes[2].id, // Persona Natural
      consolidado: false,
      minuta: 'MIN-2026-005',
      protocolo: null,
      fechaEnvio: null,
      fechaEnvioTestimonio: null,
      userCreateId: adminUserId,
    },
  });

  console.info('✓ Creadas 5 comercializadoras');

  return [
    comercializadora1,
    comercializadora2,
    comercializadora3,
    comercializadora4,
    comercializadora5,
  ];
}
