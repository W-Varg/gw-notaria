import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearClientes(prisma: PrismaClient, adminUserId: string) {
  // Clientes Personas Naturales
  const cliente1 = await prisma.cliente.create({
    data: {
      tipoCliente: 1, // NATURAL
      direccion: 'Av. 6 de Agosto #2345, La Paz',
      telefono: '77123456',
      email: 'juan.perez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '7654321',
          tipoDocumento: 'CI',
          nombres: 'Juan Carlos',
          apellidos: 'Pérez Rodríguez',
          fechaNacimiento: new Date('1985-05-15'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      tipoCliente: 1, // NATURAL
      direccion: 'Calle Murillo #456, Cochabamba',
      telefono: '72345678',
      email: 'maria.lopez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '8765432',
          tipoDocumento: 'PASS',
          nombres: 'María Fernanda',
          apellidos: 'López Gutiérrez',
          fechaNacimiento: new Date('1990-08-22'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      tipoCliente: 1, // NATURAL
      direccion: 'Av. Cristo Redentor #789, Santa Cruz',
      telefono: '69876543',
      email: 'carlos.mendez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '9876543',
          tipoDocumento: 'C-EXT',
          nombres: 'Carlos Alberto',
          apellidos: 'Méndez Vargas',
          fechaNacimiento: new Date('1978-11-30'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  // Clientes Personas Jurídicas
  const cliente4 = await prisma.cliente.create({
    data: {
      tipoCliente: 2, // JURIDICA
      direccion: 'Av. Arce #1234, Edificio Torre Empresarial, Piso 8',
      telefono: '22334455',
      email: 'contacto@techsolutions.bo',
      userCreateId: adminUserId,
      personaJuridica: {
        create: {
          nit: '1234567890',
          razonSocial: 'Tech Solutions S.R.L.',
          representanteLegal: 'Roberto Fernández Sánchez',
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente5 = await prisma.cliente.create({
    data: {
      tipoCliente: 2, // JURIDICA
      direccion: 'Calle Comercio #567, Zona Central',
      telefono: '23445566',
      email: 'info@consultores.bo',
      userCreateId: adminUserId,
      personaJuridica: {
        create: {
          nit: '9876543210',
          razonSocial: 'Consultores Asociados Bolivia S.A.',
          representanteLegal: 'Patricia Montenegro Flores',
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente6 = await prisma.cliente.create({
    data: {
      tipoCliente: 1, // NATURAL
      direccion: 'Calle Potosí #321, La Paz',
      telefono: '76543210',
      email: 'ana.martinez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '6543210',
          tipoDocumento: 'CI',
          nombres: 'Ana Lucía',
          apellidos: 'Martínez Sánchez',
          fechaNacimiento: new Date('1992-03-10'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente7 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Calle Ballivián #890, Oruro',
      telefono: '71234567',
      email: 'pedro.ramirez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '5432109',
          tipoDocumento: 'CI',
          nombres: 'Pedro Luis',
          apellidos: 'Ramírez Castro',
          fechaNacimiento: new Date('1988-07-20'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente8 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Av. Heroínas #234, Cochabamba',
      telefono: '68765432',
      email: 'sofia.torres@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '4321098',
          tipoDocumento: 'CI',
          nombres: 'Sofía Isabel',
          apellidos: 'Torres Mendoza',
          fechaNacimiento: new Date('1995-02-14'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente9 = await prisma.cliente.create({
    data: {
      tipoCliente: 2,
      direccion: 'Av. Busch #456, La Paz',
      telefono: '22445566',
      email: 'contacto@innovatech.bo',
      userCreateId: adminUserId,
      personaJuridica: {
        create: {
          nit: '2345678901',
          razonSocial: 'Innova Tech Bolivia S.R.L.',
          representanteLegal: 'Jorge Luis Fernández',
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente10 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Calle Junín #678, Tarija',
      telefono: '75432109',
      email: 'lucia.vega@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '3210987',
          tipoDocumento: 'CI',
          nombres: 'Lucía Beatriz',
          apellidos: 'Vega Morales',
          fechaNacimiento: new Date('1982-11-05'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente11 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Av. América #345, Cochabamba',
      telefono: '70987654',
      email: 'roberto.silva@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '2109876',
          tipoDocumento: 'CI',
          nombres: 'Roberto Carlos',
          apellidos: 'Silva Paredes',
          fechaNacimiento: new Date('1991-04-18'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente12 = await prisma.cliente.create({
    data: {
      tipoCliente: 2,
      direccion: 'Calle Colón #789, Santa Cruz',
      telefono: '33556677',
      email: 'ventas@exportbol.bo',
      userCreateId: adminUserId,
      personaJuridica: {
        create: {
          nit: '3456789012',
          razonSocial: 'Export Bolivia S.A.',
          representanteLegal: 'Carmen Rosa Gutiérrez',
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente13 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Calle Sucre #567, Potosí',
      telefono: '73456789',
      email: 'daniela.flores@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '1098765',
          tipoDocumento: 'CI',
          nombres: 'Daniela Andrea',
          apellidos: 'Flores Quispe',
          fechaNacimiento: new Date('1993-09-25'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente14 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Av. Montes #890, La Paz',
      telefono: '67890123',
      email: 'fernando.rios@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '9876502',
          tipoDocumento: 'PASS',
          nombres: 'Fernando Javier',
          apellidos: 'Ríos Beltrán',
          fechaNacimiento: new Date('1987-06-12'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente15 = await prisma.cliente.create({
    data: {
      tipoCliente: 2,
      direccion: 'Calle Ayacucho #123, Cochabamba',
      telefono: '44667788',
      email: 'contacto@grupoinmobiliario.bo',
      userCreateId: adminUserId,
      personaJuridica: {
        create: {
          nit: '4567890123',
          razonSocial: 'Grupo Inmobiliario del Sur S.R.L.',
          representanteLegal: 'Miguel Ángel Rojas',
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente16 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Av. Villarroel #456, La Paz',
      telefono: '72109876',
      email: 'valeria.castro@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '8765401',
          tipoDocumento: 'CI',
          nombres: 'Valeria Stephanie',
          apellidos: 'Castro Delgado',
          fechaNacimiento: new Date('1996-01-08'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente17 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Calle Bolívar #234, Santa Cruz',
      telefono: '69123456',
      email: 'andres.moreno@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '7654300',
          tipoDocumento: 'CI',
          nombres: 'Andrés Felipe',
          apellidos: 'Moreno Pérez',
          fechaNacimiento: new Date('1989-12-30'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente18 = await prisma.cliente.create({
    data: {
      tipoCliente: 2,
      direccion: 'Av. Salamanca #678, La Paz',
      telefono: '22778899',
      email: 'info@constructoraandina.bo',
      userCreateId: adminUserId,
      personaJuridica: {
        create: {
          nit: '5678901234',
          razonSocial: 'Constructora Andina S.A.',
          representanteLegal: 'Eduardo Francisco Salinas',
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente19 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Calle Linares #901, Cochabamba',
      telefono: '71876543',
      email: 'gabriela.vargas@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '6543299',
          tipoDocumento: 'CI',
          nombres: 'Gabriela Marcela',
          apellidos: 'Vargas Espinoza',
          fechaNacimiento: new Date('1994-08-16'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  const cliente20 = await prisma.cliente.create({
    data: {
      tipoCliente: 1,
      direccion: 'Av. Circunvalación #345, Santa Cruz',
      telefono: '68234567',
      email: 'ricardo.arce@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          numeroDocumento: '5432198',
          tipoDocumento: 'C-EXT',
          nombres: 'Ricardo Martín',
          apellidos: 'Arce Villanueva',
          fechaNacimiento: new Date('1986-03-22'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  console.info('Created 20 clientes (14 naturales, 6 jurídicas)');

  return {
    cliente1,
    cliente2,
    cliente3,
    cliente4,
    cliente5,
    cliente6,
    cliente7,
    cliente8,
    cliente9,
    cliente10,
    cliente11,
    cliente12,
    cliente13,
    cliente14,
    cliente15,
    cliente16,
    cliente17,
    cliente18,
    cliente19,
    cliente20,
  };
}

export async function crearServicios(
  prisma: PrismaClient,
  adminUserId: string,
  clientes: any,
  tiposDocumento: any[],
  tiposTramite: any[],
  estadosTramite: any[],
  usuarios: any,
  sucursales: any[],
) {
  // Obtener IDs de estados
  const estadoRecibido = estadosTramite.find((e) => e.nombre === 'Recibido');
  const estadoProceso = estadosTramite.find((e) => e.nombre === 'En Proceso');
  const estadoRevision = estadosTramite.find((e) => e.nombre === 'En Revisión');
  const estadoFinalizado = estadosTramite.find((e) => e.nombre === 'Finalizado');

  // Servicio 1: Escritura Pública - FINALIZADO (Santa Cruz)
  const servicio1 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-001',
      clienteId: clientes.cliente1.id,
      tipoDocumentoId: tiposDocumento[0].id,
      tipoTramiteId: tiposTramite[0].id,
      sucursalId: sucursales[0]?.id, // Santa Cruz
      estadoActualId: estadoFinalizado?.id,
      fechaInicio: new Date('2025-11-01T09:00:00Z'),
      fechaFinalizacion: new Date('2025-11-15T16:30:00Z'),
      fechaEstimadaEntrega: new Date('2025-11-15'),
      plazoEntregaDias: 15,
      prioridad: 'alta',
      observaciones:
        'Trámite de escritura pública para compraventa de inmueble. Cliente entregó toda la documentación completa.',
      contenidoFinal: 'Escritura Pública N° 145/2025 protocolizada correctamente.',
      montoTotal: 1500.0,
      saldoPendiente: 0.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 2: Poder Notarial - EN PROCESO (Cochabamba)
  const servicio2 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-002',
      clienteId: clientes.cliente2.id,
      tipoDocumentoId: tiposDocumento[1].id,
      tipoTramiteId: tiposTramite[1].id,
      sucursalId: sucursales[1]?.id, // Cochabamba
      estadoActualId: estadoProceso?.id,
      fechaInicio: new Date('2025-12-10T10:30:00Z'),
      fechaEstimadaEntrega: new Date('2025-12-17'),
      plazoEntregaDias: 7,
      prioridad: 'normal',
      observaciones:
        'Poder general para trámites bancarios y gestión de propiedades. Cliente solicita copias adicionales.',
      montoTotal: 800.0,
      saldoPendiente: 400.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 3: Certificación de Documentos - EN REVISION (Santa Cruz)
  const servicio3 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-003',
      clienteId: clientes.cliente3.id,
      tipoDocumentoId: tiposDocumento[2].id,
      tipoTramiteId: tiposTramite[2].id,
      sucursalId: sucursales[0]?.id, // Santa Cruz
      estadoActualId: estadoRevision?.id,
      fechaInicio: new Date('2025-12-18T11:00:00Z'),
      fechaEstimadaEntrega: new Date('2025-12-20'),
      plazoEntregaDias: 2,
      prioridad: 'urgente',
      observaciones:
        'Certificación de títulos académicos para trámite internacional. Requiere apostilla.',
      montoTotal: 350.0,
      saldoPendiente: 0.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 4: Constitución de Empresa - RECIBIDO
  const servicio4 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-004',
      clienteId: clientes.cliente4.id,
      tipoDocumentoId: tiposDocumento[3].id,
      tipoTramiteId: tiposTramite[0].id,
      sucursalId: sucursales[1]?.id || 1,
      estadoActualId: estadoRecibido?.id,
      fechaInicio: new Date('2026-01-02T09:00:00Z'),
      fechaEstimadaEntrega: new Date('2026-01-20'),
      plazoEntregaDias: 18,
      prioridad: 'normal',
      observaciones: 'Constitución de nueva sociedad. Pendiente documentación de socios.',
      montoTotal: 2500.0,
      saldoPendiente: 2500.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 5: Acta de Asamblea - EN PROCESO
  const servicio5 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-005',
      clienteId: clientes.cliente5.id,
      tipoDocumentoId: tiposDocumento[4].id,
      tipoTramiteId: tiposTramite[1].id,
      sucursalId: sucursales[0]?.id || 1,
      estadoActualId: estadoProceso?.id,
      fechaInicio: new Date('2026-01-03T14:00:00Z'),
      fechaEstimadaEntrega: new Date('2026-01-10'),
      plazoEntregaDias: 7,
      prioridad: 'alta',
      observaciones:
        'Protocolización de acta de asamblea extraordinaria. Modificación de estatutos.',
      montoTotal: 1200.0,
      saldoPendiente: 600.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 6: Testamento - RECIBIDO
  const servicio6 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-006',
      clienteId: clientes.cliente6.id,
      tipoDocumentoId: tiposDocumento[5].id,
      tipoTramiteId: tiposTramite[2].id,
      sucursalId: sucursales[1]?.id || 1,
      estadoActualId: estadoRecibido?.id,
      fechaInicio: new Date('2026-01-04T10:00:00Z'),
      fechaEstimadaEntrega: new Date('2026-01-11'),
      plazoEntregaDias: 7,
      prioridad: 'normal',
      observaciones: 'Testamento cerrado. Cliente requiere asesoría legal previa.',
      montoTotal: 1000.0,
      saldoPendiente: 1000.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 7: Autenticación de Firmas - FINALIZADO (Cochabamba)
  const servicio7 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-007',
      clienteId: clientes.cliente1.id,
      tipoDocumentoId: tiposDocumento[6].id,
      tipoTramiteId: tiposTramite[0].id,
      sucursalId: sucursales[1]?.id, // Cochabamba
      estadoActualId: estadoFinalizado?.id,
      fechaInicio: new Date('2025-12-05T15:00:00Z'),
      fechaFinalizacion: new Date('2025-12-05T15:45:00Z'),
      fechaEstimadaEntrega: new Date('2025-12-05'),
      plazoEntregaDias: 1,
      prioridad: 'normal',
      observaciones: 'Autenticación de firmas para contrato de trabajo.',
      contenidoFinal: 'Firmas autenticadas según registro notarial.',
      montoTotal: 150.0,
      saldoPendiente: 0.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 8: Legalización Internacional - EN REVISION (Santa Cruz)
  const servicio8 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-008',
      clienteId: clientes.cliente3.id,
      tipoDocumentoId: tiposDocumento[7].id,
      tipoTramiteId: tiposTramite[1].id,
      sucursalId: sucursales[0]?.id, // Santa Cruz
      estadoActualId: estadoRevision?.id,
      fechaInicio: new Date('2026-01-03T09:30:00Z'),
      fechaEstimadaEntrega: new Date('2026-01-12'),
      plazoEntregaDias: 9,
      prioridad: 'urgente',
      observaciones: 'Legalización de certificados médicos para visa. En proceso de apostilla.',
      montoTotal: 500.0,
      saldoPendiente: 0.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 9: Contrato de Arrendamiento - RECIBIDO (Cochabamba)
  const servicio9 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-009',
      clienteId: clientes.cliente7.id,
      tipoDocumentoId: tiposDocumento[2].id,
      tipoTramiteId: tiposTramite[0].id,
      sucursalId: sucursales[1]?.id, // Cochabamba
      estadoActualId: estadoRecibido?.id,
      fechaInicio: new Date('2026-01-04T11:00:00Z'),
      fechaEstimadaEntrega: new Date('2026-01-08'),
      plazoEntregaDias: 4,
      prioridad: 'normal',
      observaciones: 'Contrato de arrendamiento comercial. Pendiente revisión de cláusulas.',
      montoTotal: 600.0,
      saldoPendiente: 600.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 10: Certificación Académica - EN PROCESO (Santa Cruz)
  const servicio10 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-010',
      clienteId: clientes.cliente8.id,
      tipoDocumentoId: tiposDocumento[6].id,
      tipoTramiteId: tiposTramite[2].id,
      sucursalId: sucursales[0]?.id, // Santa Cruz
      estadoActualId: estadoProceso?.id,
      fechaInicio: new Date('2026-01-03T13:00:00Z'),
      fechaEstimadaEntrega: new Date('2026-01-10'),
      plazoEntregaDias: 7,
      prioridad: 'alta',
      observaciones: 'Certificación de diplomas para maestría en el exterior.',
      montoTotal: 450.0,
      saldoPendiente: 450.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 11: Constitución de Fundación - EN PROCESO
  const servicio11 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-011',
      clienteId: clientes.cliente9.id,
      tipoDocumentoId: tiposDocumento[3].id,
      tipoTramiteId: tiposTramite[1].id,
      sucursalId: sucursales[1]?.id || 1,
      estadoActualId: estadoProceso?.id,
      fechaInicio: new Date('2026-01-02T15:00:00Z'),
      fechaEstimadaEntrega: new Date('2026-01-25'),
      plazoEntregaDias: 23,
      prioridad: 'normal',
      observaciones: 'Constitución de fundación sin fines de lucro.',
      montoTotal: 2800.0,
      saldoPendiente: 2000.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  // Servicio 12: Poder Especial - FINALIZADO
  const servicio12 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-012',
      clienteId: clientes.cliente10.id,
      tipoDocumentoId: tiposDocumento[1].id,
      tipoTramiteId: tiposTramite[0].id,
      sucursalId: sucursales[1]?.id || 1,
      estadoActualId: estadoFinalizado?.id,
      fechaInicio: new Date('2025-12-20T10:00:00Z'),
      fechaFinalizacion: new Date('2025-12-23T14:00:00Z'),
      fechaEstimadaEntrega: new Date('2025-12-23'),
      plazoEntregaDias: 3,
      prioridad: 'urgente',
      observaciones: 'Poder especial para venta de propiedad.',
      contenidoFinal: 'Poder Especial N° 289/2025',
      montoTotal: 700.0,
      saldoPendiente: 0.0,
      estaActivo: true,
      userCreateId: adminUserId,
    },
  });

  console.info('Created 12 servicios');

  return {
    servicio1,
    servicio2,
    servicio3,
    servicio4,
    servicio5,
    servicio6,
    servicio7,
    servicio8,
    servicio9,
    servicio10,
    servicio11,
    servicio12,
  };
}

export async function crearHistorialEstados(
  prisma: PrismaClient,
  servicios: any,
  estadosTramite: any[],
  usuarios: any,
) {
  const estadoRecibido = estadosTramite.find((e) => e.nombre === 'Recibido');
  const estadoProceso = estadosTramite.find((e) => e.nombre === 'En Proceso');
  const estadoRevision = estadosTramite.find((e) => e.nombre === 'En Revisión');
  const estadoFinalizado = estadosTramite.find((e) => e.nombre === 'Finalizado');

  // Historial para servicio1 (FINALIZADO)
  await prisma.historialEstadosServicio.createMany({
    data: [
      {
        servicioId: servicios.servicio1.id,
        estadoId: estadoRecibido.id,
        usuarioId: usuarios.adminUser.id,
        fechaCambio: new Date('2025-11-01T09:00:00Z'),
        comentario: 'Servicio iniciado - Documentación recibida',
      },
      {
        servicioId: servicios.servicio1.id,
        estadoId: estadoProceso.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2025-11-03T10:30:00Z'),
        comentario: 'En proceso de verificación legal',
      },
      {
        servicioId: servicios.servicio1.id,
        estadoId: estadoRevision.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2025-11-10T14:00:00Z'),
        comentario: 'Documento en revisión final',
      },
      {
        servicioId: servicios.servicio1.id,
        estadoId: estadoFinalizado.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2025-11-15T16:30:00Z'),
        comentario: 'Escritura protocolizada y entregada al cliente',
      },
    ],
  });

  // Historial para servicio2 (EN PROCESO)
  await prisma.historialEstadosServicio.createMany({
    data: [
      {
        servicioId: servicios.servicio2.id,
        estadoId: estadoRecibido.id,
        usuarioId: usuarios.asistenteUser.id,
        fechaCambio: new Date('2025-12-10T10:30:00Z'),
        comentario: 'Solicitud registrada',
      },
      {
        servicioId: servicios.servicio2.id,
        estadoId: estadoProceso.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2025-12-12T11:00:00Z'),
        comentario: 'Redacción del poder en curso',
      },
    ],
  });

  // Historial para servicio3 (EN REVISION)
  await prisma.historialEstadosServicio.createMany({
    data: [
      {
        servicioId: servicios.servicio3.id,
        estadoId: estadoRecibido.id,
        usuarioId: usuarios.asistenteUser.id,
        fechaCambio: new Date('2025-12-18T11:00:00Z'),
        comentario: 'Documentos recibidos para certificación',
      },
      {
        servicioId: servicios.servicio3.id,
        estadoId: estadoProceso.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2025-12-18T15:00:00Z'),
        comentario: 'Certificación en proceso',
      },
      {
        servicioId: servicios.servicio3.id,
        estadoId: estadoRevision.id,
        usuarioId: usuarios.managerUser.id,
        fechaCambio: new Date('2025-12-19T10:00:00Z'),
        comentario: 'Revisión final antes de apostilla',
      },
    ],
  });

  // Historial para servicio4 (RECIBIDO)
  await prisma.historialEstadosServicio.create({
    data: {
      servicioId: servicios.servicio4.id,
      estadoId: estadoRecibido.id,
      usuarioId: usuarios.asistenteUser.id,
      fechaCambio: new Date('2026-01-02T09:00:00Z'),
      comentario: 'Inicio de trámite de constitución',
    },
  });

  // Historial para servicio5 (EN PROCESO)
  await prisma.historialEstadosServicio.createMany({
    data: [
      {
        servicioId: servicios.servicio5.id,
        estadoId: estadoRecibido.id,
        usuarioId: usuarios.adminUser.id,
        fechaCambio: new Date('2026-01-03T14:00:00Z'),
        comentario: 'Acta recibida para protocolización',
      },
      {
        servicioId: servicios.servicio5.id,
        estadoId: estadoProceso.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2026-01-04T09:00:00Z'),
        comentario: 'Revisión de modificaciones estatutarias',
      },
    ],
  });

  // Historial para servicio6 (RECIBIDO)
  await prisma.historialEstadosServicio.create({
    data: {
      servicioId: servicios.servicio6.id,
      estadoId: estadoRecibido.id,
      usuarioId: usuarios.asistenteUser.id,
      fechaCambio: new Date('2026-01-04T10:00:00Z'),
      comentario: 'Cita programada para asesoría de testamento',
    },
  });

  // Historial para servicio7 (FINALIZADO)
  await prisma.historialEstadosServicio.createMany({
    data: [
      {
        servicioId: servicios.servicio7.id,
        estadoId: estadoRecibido.id,
        usuarioId: usuarios.asistenteUser.id,
        fechaCambio: new Date('2025-12-05T15:00:00Z'),
        comentario: 'Cliente presente para autenticación',
      },
      {
        servicioId: servicios.servicio7.id,
        estadoId: estadoFinalizado.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2025-12-05T15:45:00Z'),
        comentario: 'Firmas autenticadas y documento entregado',
      },
    ],
  });

  // Historial para servicio8 (EN REVISIÓN)
  await prisma.historialEstadosServicio.createMany({
    data: [
      {
        servicioId: servicios.servicio8.id,
        estadoId: estadoRecibido.id,
        usuarioId: usuarios.asistenteUser.id,
        fechaCambio: new Date('2026-01-03T09:30:00Z'),
        comentario: 'Documentos recibidos para legalización',
      },
      {
        servicioId: servicios.servicio8.id,
        estadoId: estadoProceso.id,
        usuarioId: usuarios.notarioUser.id,
        fechaCambio: new Date('2026-01-03T14:00:00Z'),
        comentario: 'Certificación notarial realizada',
      },
      {
        servicioId: servicios.servicio8.id,
        estadoId: estadoRevision.id,
        usuarioId: usuarios.managerUser.id,
        fechaCambio: new Date('2026-01-04T11:00:00Z'),
        comentario: 'Enviado a Cancillería para apostilla',
      },
    ],
  });

  console.info('Created historial de estados for 8 servicios');
}

export async function crearResponsables(prisma: PrismaClient, servicios: any, usuarios: any) {
  await prisma.responsableServicio.createMany({
    data: [
      // Servicio 1 - Completado (responsable dado de baja)
      {
        servicioId: servicios.servicio1.id,
        usuarioId: usuarios.notarioUser.id,
        fechaAsignacion: new Date('2025-11-01T09:00:00Z'),
        fechaBaja: new Date('2025-11-15T16:30:00Z'),
        activo: false,
      },
      // Servicio 2 - Activo
      {
        servicioId: servicios.servicio2.id,
        usuarioId: usuarios.notarioUser.id,
        fechaAsignacion: new Date('2025-12-10T10:30:00Z'),
        activo: true,
      },
      {
        servicioId: servicios.servicio2.id,
        usuarioId: usuarios.asistenteUser.id,
        fechaAsignacion: new Date('2025-12-10T10:30:00Z'),
        activo: true,
      },
      // Servicio 3 - Activo
      {
        servicioId: servicios.servicio3.id,
        usuarioId: usuarios.managerUser.id,
        fechaAsignacion: new Date('2025-12-18T11:00:00Z'),
        activo: true,
      },
      {
        servicioId: servicios.servicio3.id,
        usuarioId: usuarios.notarioUser.id,
        fechaAsignacion: new Date('2025-12-18T11:00:00Z'),
        activo: true,
      },
      // Servicio 4 - Activo
      {
        servicioId: servicios.servicio4.id,
        usuarioId: usuarios.asistenteUser.id,
        fechaAsignacion: new Date('2026-01-02T09:00:00Z'),
        activo: true,
      },
      // Servicio 5 - Activo
      {
        servicioId: servicios.servicio5.id,
        usuarioId: usuarios.notarioUser.id,
        fechaAsignacion: new Date('2026-01-03T14:00:00Z'),
        activo: true,
      },
      // Servicio 6 - Activo
      {
        servicioId: servicios.servicio6.id,
        usuarioId: usuarios.notarioUser.id,
        fechaAsignacion: new Date('2026-01-04T10:00:00Z'),
        activo: true,
      },
      // Servicio 7 - Completado (responsable dado de baja)
      {
        servicioId: servicios.servicio7.id,
        usuarioId: usuarios.notarioUser.id,
        fechaAsignacion: new Date('2025-12-05T15:00:00Z'),
        fechaBaja: new Date('2025-12-05T15:45:00Z'),
        activo: false,
      },
      // Servicio 8 - Activo
      {
        servicioId: servicios.servicio8.id,
        usuarioId: usuarios.managerUser.id,
        fechaAsignacion: new Date('2026-01-03T09:30:00Z'),
        activo: true,
      },
    ],
  });

  console.info('Created 10 responsables de servicio');
}

export async function crearDerivaciones(prisma: PrismaClient, servicios: any, usuarios: any) {
  await prisma.derivacionServicio.createMany({
    data: [
      // Derivación 1: Servicio 2 - Del asistente al notario (Aceptada y visualizada)
      {
        servicioId: servicios.servicio2.id,
        usuarioOrigenId: usuarios.asistenteUser.id,
        usuarioDestinoId: usuarios.notarioUser.id,
        fechaDerivacion: new Date('2025-12-11T09:00:00Z'),
        motivo: 'Requiere revisión legal especializada',
        prioridad: 'normal',
        comentario:
          'Cliente solicita poder general con cláusulas específicas que requieren revisión del notario.',
        aceptada: true,
        fechaAceptacion: new Date('2025-12-11T10:30:00Z'),
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2025-12-11T10:15:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 2: Servicio 3 - Del notario al manager (Aceptada y visualizada)
      {
        servicioId: servicios.servicio3.id,
        usuarioOrigenId: usuarios.notarioUser.id,
        usuarioDestinoId: usuarios.managerUser.id,
        fechaDerivacion: new Date('2025-12-19T08:00:00Z'),
        motivo: 'Requiere coordinación para apostilla internacional',
        prioridad: 'urgente',
        comentario: 'Documentos certificados listos. Necesita gestión de apostilla en Cancillería.',
        aceptada: true,
        fechaAceptacion: new Date('2025-12-19T09:15:00Z'),
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2025-12-19T08:30:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 3: Servicio 4 - Del asistente al notario (Pendiente, visualizada pero no aceptada)
      {
        servicioId: servicios.servicio4.id,
        usuarioOrigenId: usuarios.asistenteUser.id,
        usuarioDestinoId: usuarios.notarioUser.id,
        fechaDerivacion: new Date('2026-01-03T14:30:00Z'),
        motivo: 'Documentación completa - Lista para revisión notarial',
        prioridad: 'normal',
        comentario:
          'Cliente completó entrega de documentos de socios. Listo para redacción de estatutos.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2026-01-03T15:00:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 4: Servicio 5 - Del notario al manager (Aceptada y visualizada)
      {
        servicioId: servicios.servicio5.id,
        usuarioOrigenId: usuarios.notarioUser.id,
        usuarioDestinoId: usuarios.managerUser.id,
        fechaDerivacion: new Date('2026-01-04T15:00:00Z'),
        motivo: 'Requiere aprobación de modificaciones estatutarias',
        prioridad: 'alta',
        comentario:
          'Acta redactada con modificaciones significativas. Requiere visto bueno antes de protocolización.',
        aceptada: true,
        fechaAceptacion: new Date('2026-01-04T16:00:00Z'),
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2026-01-04T15:20:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 5: Servicio 8 - Del manager al notario (Pendiente, no visualizada)
      {
        servicioId: servicios.servicio8.id,
        usuarioOrigenId: usuarios.managerUser.id,
        usuarioDestinoId: usuarios.notarioUser.id,
        fechaDerivacion: new Date('2026-01-05T10:00:00Z'),
        motivo: 'Apostilla obtenida - Lista para entrega',
        prioridad: 'alta',
        comentario:
          'Documentos apostillados recibidos de Cancillería. Listos para firma final y entrega al cliente.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: true,
        visualizada: false,
        fechaVisualizacion: null,
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 6: Servicio 2 - Del notario al asistente (Aceptada y visualizada)
      {
        servicioId: servicios.servicio2.id,
        usuarioOrigenId: usuarios.notarioUser.id,
        usuarioDestinoId: usuarios.asistenteUser.id,
        fechaDerivacion: new Date('2025-12-14T11:00:00Z'),
        motivo: 'Preparar copias certificadas adicionales',
        prioridad: 'normal',
        comentario: 'Poder finalizado. Cliente solicita 3 copias certificadas adicionales.',
        aceptada: true,
        fechaAceptacion: new Date('2025-12-14T11:30:00Z'),
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2025-12-14T11:15:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 7: Servicio 6 - Del asistente al notario (CANCELADA - VISUALIZADA)
      {
        servicioId: servicios.servicio6.id,
        usuarioOrigenId: usuarios.asistenteUser.id,
        usuarioDestinoId: usuarios.notarioUser.id,
        fechaDerivacion: new Date('2026-01-04T14:00:00Z'),
        motivo: 'Consulta inicial para testamento',
        prioridad: 'normal',
        comentario: 'Cliente requiere asesoría legal previa antes de redactar testamento.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: false,
        visualizada: true,
        fechaVisualizacion: new Date('2026-01-04T14:30:00Z'),
        motivoCancelacion: 'Cliente decidió posponer el trámite hasta el próximo mes',
        fechaCancelacion: new Date('2026-01-05T09:00:00Z'),
        usuarioCancelacionId: usuarios.asistenteUser.id,
      },
      // Derivación 8: Servicio 4 - Del notario al manager (ACEPTADA y VISUALIZADA)
      {
        servicioId: servicios.servicio4.id,
        usuarioOrigenId: usuarios.notarioUser.id,
        usuarioDestinoId: usuarios.managerUser.id,
        fechaDerivacion: new Date('2026-01-05T16:00:00Z'),
        motivo: 'Revisión de estatutos de constitución',
        prioridad: 'alta',
        comentario:
          'Estatutos redactados conforme a normativa vigente. Requiere aprobación gerencial antes de presentar a FUNDEMPRESA.',
        aceptada: true,
        fechaAceptacion: new Date('2026-01-06T08:30:00Z'),
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2026-01-06T08:00:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 9: Servicio 5 - Del manager al notario (PENDIENTE NO VISUALIZADA)
      {
        servicioId: servicios.servicio5.id,
        usuarioOrigenId: usuarios.managerUser.id,
        usuarioDestinoId: usuarios.notarioUser.id,
        fechaDerivacion: new Date('2026-01-05T11:00:00Z'),
        motivo: 'Aprobado - Proceder con protocolización',
        prioridad: 'urgente',
        comentario: 'Modificaciones estatutarias aprobadas. Listo para protocolización y registro.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: true,
        visualizada: false,
        fechaVisualizacion: null,
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 10: Servicio 3 - Del manager al asistente (ACEPTADA y VISUALIZADA)
      {
        servicioId: servicios.servicio3.id,
        usuarioOrigenId: usuarios.managerUser.id,
        usuarioDestinoId: usuarios.asistenteUser.id,
        fechaDerivacion: new Date('2025-12-20T10:00:00Z'),
        motivo: 'Documentos listos para entrega',
        prioridad: 'urgente',
        comentario:
          'Certificados apostillados recibidos. Coordinar con cliente para entrega inmediata.',
        aceptada: true,
        fechaAceptacion: new Date('2025-12-20T10:30:00Z'),
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2025-12-20T10:15:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 11: Servicio 6 - Del notario al asistente (PENDIENTE VISUALIZADA)
      {
        servicioId: servicios.servicio6.id,
        usuarioOrigenId: usuarios.notarioUser.id,
        usuarioDestinoId: usuarios.asistenteUser.id,
        fechaDerivacion: new Date('2026-01-06T09:00:00Z'),
        motivo: 'Programar asesoría legal para testamento',
        prioridad: 'normal',
        comentario:
          'Cliente confirmó disponibilidad. Programar cita para el 10 de enero para asesoría completa.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2026-01-06T09:30:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 12: Servicio 2 - Del asistente al manager (CANCELADA NO VISUALIZADA)
      {
        servicioId: servicios.servicio2.id,
        usuarioOrigenId: usuarios.asistenteUser.id,
        usuarioDestinoId: usuarios.managerUser.id,
        fechaDerivacion: new Date('2025-12-15T14:00:00Z'),
        motivo: 'Consulta sobre cobro adicional',
        prioridad: 'baja',
        comentario: 'Cliente pregunta sobre el costo de las copias adicionales.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: false,
        visualizada: false,
        fechaVisualizacion: null,
        motivoCancelacion: 'Error en derivación - Consulta resuelta directamente con el cliente',
        fechaCancelacion: new Date('2025-12-15T15:00:00Z'),
        usuarioCancelacionId: usuarios.asistenteUser.id,
      },
      // Derivación 13: Servicio 9 - Del asistente al notario (PENDIENTE NO VISUALIZADA)
      {
        servicioId: servicios.servicio9.id,
        usuarioOrigenId: usuarios.asistenteUser.id,
        usuarioDestinoId: usuarios.notarioUser.id,
        fechaDerivacion: new Date('2026-01-05T08:00:00Z'),
        motivo: 'Revisión de contrato de arrendamiento',
        prioridad: 'normal',
        comentario:
          'Contrato recibido con cláusulas especiales. Requiere revisión legal antes de protocolizar.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: true,
        visualizada: false,
        fechaVisualizacion: null,
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
      // Derivación 14: Servicio 10 - Del notario al manager (CANCELADA VISUALIZADA)
      {
        servicioId: servicios.servicio10.id,
        usuarioOrigenId: usuarios.notarioUser.id,
        usuarioDestinoId: usuarios.managerUser.id,
        fechaDerivacion: new Date('2026-01-04T10:00:00Z'),
        motivo: 'Verificación de apostilla necesaria',
        prioridad: 'alta',
        comentario: 'Cliente requiere apostilla para certificado académico.',
        aceptada: false,
        fechaAceptacion: null,
        estaActiva: false,
        visualizada: true,
        fechaVisualizacion: new Date('2026-01-04T11:00:00Z'),
        motivoCancelacion:
          'Cliente confirmó que no necesita apostilla por el momento. Se procederá solo con certificación.',
        fechaCancelacion: new Date('2026-01-04T14:00:00Z'),
        usuarioCancelacionId: usuarios.notarioUser.id,
      },
      // Derivación 15: Servicio 11 - Del manager al notario (ACEPTADA y VISUALIZADA)
      {
        servicioId: servicios.servicio11.id,
        usuarioOrigenId: usuarios.managerUser.id,
        usuarioDestinoId: usuarios.notarioUser.id,
        fechaDerivacion: new Date('2026-01-03T09:00:00Z'),
        motivo: 'Aprobación de estatutos de fundación',
        prioridad: 'alta',
        comentario: 'Estatutos revisados y aprobados por gerencia. Proceder con protocolización.',
        aceptada: true,
        fechaAceptacion: new Date('2026-01-03T10:00:00Z'),
        estaActiva: true,
        visualizada: true,
        fechaVisualizacion: new Date('2026-01-03T09:30:00Z'),
        motivoCancelacion: null,
        fechaCancelacion: null,
        usuarioCancelacionId: null,
      },
    ],
  });

  console.info('Created 15 derivaciones de servicios con diferentes estados');
}
