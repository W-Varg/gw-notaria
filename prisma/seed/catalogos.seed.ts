import { Prisma, PrismaClient } from '../../src/generated/prisma/client';

export async function createSucursales(prisma: PrismaClient, userId: string) {
  const sucursales = await prisma.sucursal.createManyAndReturn({
    data: [
      {
        nombre: 'Notaría Santa Cruz 69',
        abreviacion: 'NSC-69',
        departamento: 'Santa Cruz',
        direccion: 'Av. Cristóbal de Mendoza #569, entre 2do y 3er anillo',
        telefono: '3-3456789',
        email: 'santacruz69@notaria.bo',
        estaActiva: true,
        userCreateId: userId,
      },
      {
        nombre: 'Notaría Cochabamba 68',
        abreviacion: 'NCB-68',
        departamento: 'Cochabamba',
        direccion: 'Av. Heroínas #568, Zona Central',
        telefono: '4-4567890',
        email: 'cochabamba68@notaria.bo',
        estaActiva: true,
        userCreateId: userId,
      },
    ],
  });

  console.info(`Created ${sucursales.length} sucursales (notarías)`);
  return sucursales;
}

export async function createTiposTramite(
  prisma: PrismaClient,
  userId: string,
  tiposDocumento: any[],
  sucursales: any[],
) {
  // Definir plantillas base de tipos de trámite (sin sucursalId)
  const tiposTramiteBase = [
    {
      tipoDocumentoId: tiposDocumento.find((t) => t.nombre === 'Poder General')?.id,
      nombre: 'Poder General Administrativo',
      descripcion: 'Poder para gestiones administrativas y bancarias',
      claseTramite: 'Poderes',
      negocio: 'Administrativo',
      colorHex: '#3498db',
      icon: 'pi pi-file-edit',
      costoBase: 350.0,
      estaActiva: true,
      userCreateId: userId,
    },
    {
      tipoDocumentoId: tiposDocumento.find((t) => t.nombre === 'Poder Especial')?.id,
      nombre: 'Poder Especial de Venta',
      descripcion: 'Poder específico para venta de inmueble',
      claseTramite: 'Poderes',
      negocio: 'Inmobiliario',
      colorHex: '#9b59b6',
      icon: 'pi pi-home',
      costoBase: 300.0,
      estaActiva: true,
      userCreateId: userId,
    },
    {
      tipoDocumentoId: tiposDocumento.find((t) => t.nombre === 'Compraventa de Inmueble')?.id,
      nombre: 'Compraventa Casa',
      descripcion: 'Compraventa de casa o departamento',
      claseTramite: 'Compraventa',
      negocio: 'Inmobiliario',
      colorHex: '#e67e22',
      icon: 'pi pi-building',
      costoBase: 800.0,
      estaActiva: true,
      userCreateId: userId,
    },
    {
      tipoDocumentoId: tiposDocumento.find((t) => t.nombre === 'Compraventa de Inmueble')?.id,
      nombre: 'Compraventa Terreno',
      descripcion: 'Compraventa de terreno urbano o rural',
      claseTramite: 'Compraventa',
      negocio: 'Inmobiliario',
      colorHex: '#16a085',
      icon: 'pi pi-map',
      costoBase: 850.0,
      estaActiva: true,
      userCreateId: userId,
    },
    {
      tipoDocumentoId: tiposDocumento.find((t) => t.nombre === 'Testamento Abierto')?.id,
      nombre: 'Testamento Público',
      descripcion: 'Testamento abierto ante notario',
      claseTramite: 'Testamentos',
      negocio: 'Sucesorio',
      colorHex: '#34495e',
      icon: 'pi pi-book',
      costoBase: 500.0,
      estaActiva: true,
      userCreateId: userId,
    },
  ];

  const tiposTramiteCreados = [];
  
  // Crear tipos de trámite para cada sucursal con relación explícita
  for (const sucursal of sucursales) {
    console.info(`Creating tipos de trámite for sucursal: ${sucursal.nombre}...`);
    
    for (const tipoBase of tiposTramiteBase) {
      // Solo crear si tiene tipo de documento asociado
      if (!tipoBase.tipoDocumentoId) continue;
      
      // Ajustar precio según sucursal (Cochabamba 10% menos que Santa Cruz)
      const precioAjustado = sucursal.abreviacion === 'NCB-68' 
        ? Number(tipoBase.costoBase) * 0.9 
        : Number(tipoBase.costoBase);
      
      // Crear tipo de trámite con relación a sucursal
      const tipoTramiteCreado = await prisma.tipoTramite.create({
        data: {
          ...tipoBase,
          sucursalId: sucursal.id, // Relación con sucursal
          costoBase: precioAjustado,
        },
      });
      
      tiposTramiteCreados.push(tipoTramiteCreado);
    }
  }

  console.info(`✓ Created ${tiposTramiteCreados.length} tipos de trámite para ${sucursales.length} sucursales`);
  console.info(`  - ${tiposTramiteCreados.length / sucursales.length} tipos por sucursal`);
  
  return tiposTramiteCreados;
}

export async function createBancos(prisma: PrismaClient, userId: string) {
  const bancos = [
    { nombre: 'Banco Nacional de Bolivia (BNB)', userCreateId: userId },
    { nombre: 'Banco Unión', userCreateId: userId },
    { nombre: 'Banco Mercantil Santa Cruz', userCreateId: userId },
    { nombre: 'Banco BISA', userCreateId: userId },
    { nombre: 'Banco Ganadero', userCreateId: userId },
    { nombre: 'Banco Económico', userCreateId: userId },
    { nombre: 'Banco Solidario', userCreateId: userId },
    { nombre: 'Banco FIE', userCreateId: userId },
    { nombre: 'Banco Fortaleza', userCreateId: userId },
    { nombre: 'Banco Prodem', userCreateId: userId },
  ];

  const bancosCreados = [];
  for (const banco of bancos) {
    const bancoCreado = await prisma.banco.create({ data: banco });
    bancosCreados.push(bancoCreado);
  }

  console.info(`Created ${bancosCreados.length} bancos`);
  return bancosCreados;
}

export async function createCuentasBancarias(prisma: PrismaClient, userId: string, bancos: any[]) {
  const cuentasBancarias = [
    {
      bancoId: bancos[0].id, // BNB
      numeroCuenta: '1000123456789',
      tipoCuenta: 'Cuenta Corriente',
      saldoActual: 50000.0,
      userCreateId: userId,
    },
    {
      bancoId: bancos[1].id, // Banco Unión
      numeroCuenta: '2000987654321',
      tipoCuenta: 'Caja de Ahorro',
      saldoActual: 30000.0,
      userCreateId: userId,
    },
    {
      bancoId: bancos[2].id, // BMSC
      numeroCuenta: '3000555666777',
      tipoCuenta: 'Cuenta Corriente',
      saldoActual: 75000.0,
      userCreateId: userId,
    },
    {
      bancoId: bancos[3].id, // BISA
      numeroCuenta: '4000111222333',
      tipoCuenta: 'Caja de Ahorro',
      saldoActual: 20000.0,
      userCreateId: userId,
    },
  ];

  const cuentasCreadas = [];
  for (const cuenta of cuentasBancarias) {
    const cuentaCreada = await prisma.cuentaBancaria.create({ data: cuenta });
    cuentasCreadas.push(cuentaCreada);
  }

  console.info(`Created ${cuentasCreadas.length} cuentas bancarias`);
  return cuentasCreadas;
}

export async function createTiposDocumento(prisma: PrismaClient, userId: string) {
  const tiposDocumento = [
    {
      nombre: 'Poder General',
      descripcion:
        'Otorga facultades amplias para actuar en nombre del poderdante en diversos actos jurídicos',
      precioBase: 350.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Poder Especial',
      descripcion: 'Otorga facultades específicas para realizar actos jurídicos determinados',
      precioBase: 300.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Compraventa de Inmueble',
      descripcion: 'Contrato de transferencia de propiedad inmueble entre comprador y vendedor',
      precioBase: 800.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Compraventa de Vehículo',
      descripcion: 'Contrato de transferencia de propiedad de vehículo automotor',
      precioBase: 400.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Testamento Abierto',
      descripcion: 'Documento que expresa la última voluntad del testador de forma pública',
      precioBase: 500.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Testamento Cerrado',
      descripcion: 'Documento que expresa la última voluntad del testador de forma privada',
      precioBase: 550.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Acta de Protesto',
      descripcion: 'Documento que certifica el protesto de un título valor',
      precioBase: 250.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Certificación de Firma',
      descripcion: 'Autenticación de la firma de una persona en un documento',
      precioBase: 80.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Certificación de Copia',
      descripcion: 'Autenticación de que una copia es fiel reproducción del original',
      precioBase: 50.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Acta de Constatación',
      descripcion: 'Documento que certifica hechos o circunstancias observadas por el notario',
      precioBase: 350.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Constitución de Sociedad',
      descripcion: 'Documento de constitución de persona jurídica o sociedad comercial',
      precioBase: 1200.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Modificación de Estatutos',
      descripcion: 'Modificación de estatutos de sociedad o persona jurídica',
      precioBase: 600.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Contrato de Arrendamiento',
      descripcion: 'Contrato de alquiler de bienes muebles o inmuebles',
      precioBase: 250.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Contrato de Préstamo',
      descripcion: 'Contrato de mutuo o préstamo de dinero entre particulares',
      precioBase: 300.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Reconocimiento de Deuda',
      descripcion: 'Documento que reconoce una obligación dineraria',
      precioBase: 200.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Declaración Jurada',
      descripcion: 'Declaración formal bajo juramento ante notario',
      precioBase: 150.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Apostilla',
      descripcion: 'Legalización de documentos para uso internacional (Convenio de La Haya)',
      precioBase: 400.0,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Traducciones Certificadas',
      descripcion: 'Traducción oficial de documentos con certificación notarial',
      precioBase: 180.0,
      estaActivo: true,
      userCreateId: userId,
    },
  ];

  const tiposCreados = [];
  for (const tipo of tiposDocumento) {
    const tipoCreado = await prisma.tipoDocumento.create({ data: tipo });
    tiposCreados.push(tipoCreado);
  }

  console.info(`Created ${tiposCreados.length} tipos de documento`);
  return tiposCreados;
}

export async function createEstadosTramite(prisma: PrismaClient, userId: string) {
  const estadosTramite = [
    {
      nombre: 'Recibido',
      descripcion: 'El trámite ha sido recibido y está en espera de revisión',
      colorHex: '#3498db',
      orden: 1,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'En Revisión',
      descripcion: 'El trámite está siendo revisado por el personal',
      colorHex: '#f39c12',
      orden: 2,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Observado',
      descripcion: 'El trámite tiene observaciones que deben ser corregidas',
      colorHex: '#e74c3c',
      orden: 3,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'En Proceso',
      descripcion: 'El trámite está siendo procesado',
      colorHex: '#9b59b6',
      orden: 4,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Pendiente de Firma',
      descripcion: 'El trámite está listo y pendiente de firma',
      colorHex: '#e67e22',
      orden: 5,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Finalizado',
      descripcion: 'El trámite ha sido completado exitosamente',
      colorHex: '#27ae60',
      orden: 6,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Cancelado',
      descripcion: 'El trámite ha sido cancelado',
      colorHex: '#95a5a6',
      orden: 7,
      estaActivo: true,
      userCreateId: userId,
    },
    {
      nombre: 'Rechazado',
      descripcion: 'El trámite ha sido rechazado',
      colorHex: '#c0392b',
      orden: 8,
      estaActivo: true,
      userCreateId: userId,
    },
  ];

  const estadosCreados = [];

  for (const estado of estadosTramite) {
    const estadoCreado = await prisma.estadoTramite.create({
      data: estado,
    });
    estadosCreados.push(estadoCreado);
  }

  console.info(`Created ${estadosCreados.length} estados de trámite`);
  return estadosCreados;
}
