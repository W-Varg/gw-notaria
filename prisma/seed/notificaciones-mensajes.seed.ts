import { PrismaClient } from '../../src/generated/prisma/client';

export async function crearNotificaciones(
  prisma: PrismaClient,
  adminUserId: string,
  usuarios: any,
  servicios: any,
) {
  await prisma.notificacion.createMany({
    data: [
      // Notificaciones para el admin
      {
        usuarioId: usuarios.adminUser.id,
        titulo: 'Nuevo usuario registrado',
        mensaje:
          'Se ha registrado un nuevo usuario en el sistema: María López (maria.lopez@email.com)',
        tipo: 'info',
        leida: true,
        icono: 'pi-user-plus',
        ruta: '/admin/usuarios',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2025-12-10T08:30:00Z'),
      },
      {
        usuarioId: usuarios.adminUser.id,
        titulo: 'Sistema actualizado',
        mensaje: 'El sistema ha sido actualizado a la versión 1.2.0 con nuevas funcionalidades.',
        tipo: 'success',
        leida: true,
        icono: 'pi-check-circle',
        ruta: null,
        userCreateId: adminUserId,
        fechaCreacion: new Date('2025-12-01T09:00:00Z'),
      },
      {
        usuarioId: usuarios.adminUser.id,
        titulo: 'Respaldo programado',
        mensaje: 'Recuerda que el respaldo de la base de datos está programado para esta noche.',
        tipo: 'warning',
        leida: false,
        icono: 'pi-database',
        ruta: '/admin/configuracion',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-06T07:00:00Z'),
      },

      // Notificaciones para el notario
      {
        usuarioId: usuarios.notarioUser.id,
        titulo: 'Nuevo servicio asignado',
        mensaje: `Se te ha asignado el servicio ${servicios.servicio2.codigoTicket} - Poder Notarial.`,
        tipo: 'info',
        leida: false,
        icono: 'pi-briefcase',
        ruta: `/servicios/${servicios.servicio2.id}`,
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-05T10:00:00Z'),
      },
      {
        usuarioId: usuarios.notarioUser.id,
        titulo: 'Derivación pendiente',
        mensaje:
          'Tienes una derivación pendiente del servicio TKT-2026-009 que requiere tu atención.',
        tipo: 'warning',
        leida: false,
        icono: 'pi-arrow-right',
        ruta: '/derivaciones',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-05T14:30:00Z'),
      },
      {
        usuarioId: usuarios.notarioUser.id,
        titulo: 'Servicio finalizado',
        mensaje: `El servicio ${servicios.servicio1.codigoTicket} ha sido completado exitosamente.`,
        tipo: 'success',
        leida: true,
        icono: 'pi-check',
        ruta: `/servicios/${servicios.servicio1.id}`,
        userCreateId: adminUserId,
        fechaCreacion: new Date('2025-11-15T16:30:00Z'),
      },

      // Notificaciones para el asistente
      {
        usuarioId: usuarios.asistenteUser.id,
        titulo: 'Cliente esperando',
        mensaje: 'El cliente Juan Pérez está esperando para recoger su documento.',
        tipo: 'info',
        leida: false,
        icono: 'pi-user',
        ruta: '/recepcion',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-06T09:15:00Z'),
      },
      {
        usuarioId: usuarios.asistenteUser.id,
        titulo: 'Derivación aceptada',
        mensaje: 'Tu derivación del servicio TKT-2026-008 ha sido aceptada por el Manager.',
        tipo: 'success',
        leida: true,
        icono: 'pi-check-circle',
        ruta: '/derivaciones',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2025-12-19T09:15:00Z'),
      },
      {
        usuarioId: usuarios.asistenteUser.id,
        titulo: 'Pago recibido',
        mensaje: 'Se ha registrado un pago de Bs. 400 para el servicio TKT-2025-002.',
        tipo: 'success',
        leida: true,
        icono: 'pi-money-bill',
        ruta: '/pagos',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2025-12-12T11:00:00Z'),
      },

      // Notificaciones para el manager
      {
        usuarioId: usuarios.managerUser.id,
        titulo: 'Solicitud de aprobación',
        mensaje:
          'Se requiere tu aprobación para las modificaciones estatutarias del servicio TKT-2026-005.',
        tipo: 'warning',
        leida: false,
        icono: 'pi-exclamation-triangle',
        ruta: `/servicios/${servicios.servicio5.id}`,
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-04T15:00:00Z'),
      },
      {
        usuarioId: usuarios.managerUser.id,
        titulo: 'Reporte mensual disponible',
        mensaje: 'El reporte de servicios del mes de diciembre está disponible para su revisión.',
        tipo: 'info',
        leida: false,
        icono: 'pi-chart-bar',
        ruta: '/reportes/mensual',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-02T08:00:00Z'),
      },
      {
        usuarioId: usuarios.managerUser.id,
        titulo: 'Apostilla completada',
        mensaje:
          'Los documentos del servicio TKT-2026-003 han sido apostillados exitosamente.',
        tipo: 'success',
        leida: true,
        icono: 'pi-verified',
        ruta: `/servicios/${servicios.servicio3.id}`,
        userCreateId: adminUserId,
        fechaCreacion: new Date('2025-12-19T16:00:00Z'),
      },

      // Notificaciones para el cliente
      {
        usuarioId: usuarios.clientUser.id,
        titulo: 'Documento listo para recoger',
        mensaje:
          'Tu poder notarial está listo. Puedes pasar a recogerlo en horario de oficina.',
        tipo: 'success',
        leida: false,
        icono: 'pi-file-check',
        ruta: '/mis-servicios',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-05T17:00:00Z'),
      },
      {
        usuarioId: usuarios.clientUser.id,
        titulo: 'Pago pendiente',
        mensaje: 'Tienes un saldo pendiente de Bs. 400 por el servicio de poder notarial.',
        tipo: 'warning',
        leida: false,
        icono: 'pi-exclamation-circle',
        ruta: '/mis-servicios',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2026-01-03T10:00:00Z'),
      },
      {
        usuarioId: usuarios.clientUser.id,
        titulo: 'Servicio en proceso',
        mensaje: 'Tu trámite de escritura pública está siendo procesado por nuestro equipo.',
        tipo: 'info',
        leida: true,
        icono: 'pi-spinner',
        ruta: '/mis-servicios',
        userCreateId: adminUserId,
        fechaCreacion: new Date('2025-11-03T10:30:00Z'),
      },
    ],
  });

  console.info('Created 15 notificaciones');
}

export async function crearMensajesContacto(
  prisma: PrismaClient,
  adminUserId: string,
  usuarios: any,
) {
  await prisma.mensajeContacto.createMany({
    data: [
      // Mensajes de usuarios registrados
      {
        usuarioId: usuarios.clientUser.id,
        nombre: 'Cliente Usuario',
        correo: 'cliente@gmail.com',
        telefono: '70123456',
        asunto: 'Consulta sobre costos de escritura pública',
        mensaje:
          'Buenos días, quisiera saber cuál es el costo aproximado de una escritura pública para compraventa de un inmueble. También me gustaría conocer los documentos necesarios. Gracias.',
        categoria: 'consulta',
        estado: 'respondido',
        userCreateId: usuarios.clientUser.id,
        fechaCreacion: new Date('2025-12-15T10:30:00Z'),
      },
      {
        usuarioId: usuarios.clientUser.id,
        nombre: 'Cliente Usuario',
        correo: 'cliente@gmail.com',
        telefono: '70123456',
        asunto: 'Felicitaciones por el servicio',
        mensaje:
          'Quiero felicitar al equipo por el excelente servicio recibido. El trámite fue rápido y eficiente. Especialmente agradezco la atención de la asistente María. ¡Muy recomendado!',
        categoria: 'felicitacion',
        estado: 'leido',
        userCreateId: usuarios.clientUser.id,
        fechaCreacion: new Date('2025-11-16T14:00:00Z'),
      },

      // Mensajes anónimos
      {
        usuarioId: null,
        nombre: 'Ana Rodríguez',
        correo: 'ana.rodriguez@email.com',
        telefono: '75432198',
        asunto: '¿Atienden los sábados?',
        mensaje:
          'Hola, trabajo de lunes a viernes y me es difícil acudir en ese horario. ¿Atienden los sábados? ¿Qué horario tienen?',
        categoria: 'consulta',
        estado: 'respondido',
        userCreateId: null,
        fechaCreacion: new Date('2026-01-03T16:20:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Roberto Méndez',
        correo: 'r.mendez@empresa.com',
        telefono: '71234567',
        asunto: 'Constitución de empresa',
        mensaje:
          'Necesito información sobre el proceso y costos para constituir una SRL. Somos 3 socios. ¿Cuánto tiempo toma el trámite completo?',
        categoria: 'consulta',
        estado: 'en_proceso',
        userCreateId: null,
        fechaCreacion: new Date('2026-01-05T09:15:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Lucía Fernández',
        correo: 'lucia.fer@hotmail.com',
        telefono: null,
        asunto: 'Queja por tiempo de espera',
        mensaje:
          'El día martes 31 de diciembre acudí a sus oficinas y tuve que esperar más de 2 horas para ser atendida. Creo que deberían implementar un sistema de turnos o citas previas.',
        categoria: 'queja',
        estado: 'en_proceso',
        userCreateId: null,
        fechaCreacion: new Date('2026-01-02T11:45:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Carlos Villarroel',
        correo: 'c.villarroel@gmail.com',
        telefono: '69876543',
        asunto: 'Solicitud de cotización',
        mensaje:
          'Por favor, necesito una cotización para legalización de documentos académicos (diploma y certificados) para presentar en el extranjero. Son 5 documentos en total.',
        categoria: 'consulta',
        estado: 'respondido',
        userCreateId: null,
        fechaCreacion: new Date('2025-12-28T15:30:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Patricia Santos',
        correo: 'paty.santos@outlook.com',
        telefono: '72198765',
        asunto: 'Sugerencia: Pagos con tarjeta',
        mensaje:
          'Sería muy conveniente que implementaran pagos con tarjeta de crédito o débito. Actualmente solo aceptan efectivo y transferencias, y a veces es complicado.',
        categoria: 'sugerencia',
        estado: 'leido',
        userCreateId: null,
        fechaCreacion: new Date('2025-12-20T13:00:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Jorge Maldonado',
        correo: 'jorge.m@empresa.bo',
        telefono: '77654321',
        asunto: 'Poder notarial urgente',
        mensaje:
          '¡Urgente! Necesito un poder notarial para mañana. Viajo al exterior y debo dejar a alguien a cargo de un trámite bancario. ¿Es posible atenderme hoy?',
        categoria: 'consulta',
        estado: 'cerrado',
        userCreateId: null,
        fechaCreacion: new Date('2025-12-18T17:45:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Daniela Morales',
        correo: 'dani.morales@yahoo.com',
        telefono: '68543210',
        asunto: 'Reclamo por error en documento',
        mensaje:
          'Hay un error en mi escritura pública. El apellido de mi esposo está mal escrito. ¿Cómo puedo corregir esto? Ya pagué el servicio completo.',
        categoria: 'reclamo',
        estado: 'en_proceso',
        userCreateId: null,
        fechaCreacion: new Date('2026-01-04T10:00:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Fernando Guzmán',
        correo: 'f.guzman@legal.bo',
        telefono: '73456789',
        asunto: 'Consulta sobre testamento cerrado',
        mensaje:
          'Buenos días, quisiera información sobre los requisitos y procedimiento para hacer un testamento cerrado. ¿Necesito llevar testigos?',
        categoria: 'consulta',
        estado: 'no_leido',
        userCreateId: null,
        fechaCreacion: new Date('2026-01-06T08:30:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Mónica Bustamante',
        correo: 'monica.b@gmail.com',
        telefono: '76543210',
        asunto: 'Documentos para apostilla',
        mensaje:
          '¿Qué documentos necesito apostillar para un matrimonio en el exterior? ¿Ustedes se encargan de todo el proceso o solo de la legalización notarial?',
        categoria: 'consulta',
        estado: 'respondido',
        userCreateId: null,
        fechaCreacion: new Date('2025-12-22T11:20:00Z'),
      },
      {
        usuarioId: null,
        nombre: 'Eduardo Ramos',
        correo: 'e.ramos@hotmail.com',
        telefono: null,
        asunto: 'Otros - Solicitud de pasantía',
        mensaje:
          'Soy estudiante de Derecho de la UMSA y estoy buscando un lugar para realizar mis pasantías. ¿Tienen disponibilidad para pasantes? Adjunto mi CV.',
        categoria: 'otro',
        estado: 'leido',
        userCreateId: null,
        fechaCreacion: new Date('2025-12-10T09:00:00Z'),
      },
    ],
  });

  console.info('Created 12 mensajes de contacto');
}
