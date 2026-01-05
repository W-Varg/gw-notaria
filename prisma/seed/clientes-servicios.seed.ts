import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearClientes(prisma: PrismaClient, adminUserId: string) {
  // Clientes Personas Naturales
  const cliente1 = await prisma.cliente.create({
    data: {
      tipo: 1, // NATURAL
      direccion: 'Av. 6 de Agosto #2345, La Paz',
      telefono: '77123456',
      email: 'juan.perez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          ci: '7654321',
          expedido: 'LP',
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
      tipo: 1, // NATURAL
      direccion: 'Calle Murillo #456, Cochabamba',
      telefono: '72345678',
      email: 'maria.lopez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          ci: '8765432',
          expedido: 'CB',
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
      tipo: 1, // NATURAL
      direccion: 'Av. Cristo Redentor #789, Santa Cruz',
      telefono: '69876543',
      email: 'carlos.mendez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          ci: '9876543',
          expedido: 'SC',
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
      tipo: 2, // JURIDICA
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
      tipo: 2, // JURIDICA
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
      tipo: 1, // NATURAL
      direccion: 'Calle Potosí #321, La Paz',
      telefono: '76543210',
      email: 'ana.martinez@email.com',
      userCreateId: adminUserId,
      personaNatural: {
        create: {
          ci: '6543210',
          expedido: 'LP',
          nombres: 'Ana Lucía',
          apellidos: 'Martínez Sánchez',
          fechaNacimiento: new Date('1992-03-10'),
          userCreateId: adminUserId,
        },
      },
    },
  });

  console.info('Created 6 clientes (4 naturales, 2 jurídicas)');

  return {
    cliente1,
    cliente2,
    cliente3,
    cliente4,
    cliente5,
    cliente6,
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
) {
  // Obtener IDs de estados
  const estadoRecibido = estadosTramite.find((e) => e.nombre === 'Recibido');
  const estadoProceso = estadosTramite.find((e) => e.nombre === 'En Proceso');
  const estadoRevision = estadosTramite.find((e) => e.nombre === 'En Revisión');
  const estadoFinalizado = estadosTramite.find((e) => e.nombre === 'Finalizado');

  // Servicio 1: Escritura Pública - FINALIZADO
  const servicio1 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-001',
      clienteId: clientes.cliente1.id,
      tipoDocumentoId: tiposDocumento[0].id,
      tipoTramiteId: tiposTramite[0].id,
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

  // Servicio 2: Poder Notarial - EN PROCESO
  const servicio2 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-002',
      clienteId: clientes.cliente2.id,
      tipoDocumentoId: tiposDocumento[1].id,
      tipoTramiteId: tiposTramite[1].id,
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

  // Servicio 3: Certificación de Documentos - EN REVISION
  const servicio3 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-003',
      clienteId: clientes.cliente3.id,
      tipoDocumentoId: tiposDocumento[2].id,
      tipoTramiteId: tiposTramite[2].id,
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

  // Servicio 7: Autenticación de Firmas - FINALIZADO
  const servicio7 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2025-007',
      clienteId: clientes.cliente1.id,
      tipoDocumentoId: tiposDocumento[6].id,
      tipoTramiteId: tiposTramite[0].id,
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

  // Servicio 8: Legalización Internacional - EN REVISION
  const servicio8 = await prisma.servicio.create({
    data: {
      codigoTicket: 'TKT-2026-008',
      clienteId: clientes.cliente3.id,
      tipoDocumentoId: tiposDocumento[7].id,
      tipoTramiteId: tiposTramite[1].id,
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

  console.info('Created 8 servicios');

  return {
    servicio1,
    servicio2,
    servicio3,
    servicio4,
    servicio5,
    servicio6,
    servicio7,
    servicio8,
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
      // Derivación 1: Servicio 2 - Del asistente al notario (Aceptada)
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
      },
      // Derivación 2: Servicio 3 - Del notario al manager (Aceptada)
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
      },
      // Derivación 3: Servicio 4 - Del asistente al notario (Pendiente)
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
      },
      // Derivación 4: Servicio 5 - Del notario al manager (Aceptada)
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
      },
      // Derivación 5: Servicio 8 - Del manager al notario (Pendiente - para firma final)
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
      },
      // Derivación 6: Servicio 2 - Del notario al asistente (Aceptada - para preparar copias)
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
      },
    ],
  });

  console.info('Created 6 derivaciones de servicios');
}
