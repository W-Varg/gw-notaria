import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';
import { permisos as permisosSeed } from '../../src/modules/admin/security/permisos/permisos.data';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar la base de datos
  await clearDatabase();

  // Crear usuarios primero para obtener el ID del admin
  const usuarios = await createUsuarios();
  const adminUserId = usuarios.adminUser.id;

  // Crear roles básicos
  const roles = await createRoles(adminUserId);

  // Crear permisos
  await createPermisos();

  // Asignar permisos a roles
  await assignPermisosToRoles(roles.allRoles.map((r) => r.id));

  // Asignar roles a usuarios
  await assignRolesToUsers(usuarios.adminUser.id, roles.adminRole.id);
  await assignRolesToUsers(usuarios.clientUser.id, roles.clientRole.id);
  await assignRolesToUsers(
    usuarios.managerUser.id,
    roles.allRoles.find((r) => r.nombre === 'MANAGER').id,
  );
  await assignRolesToUsers(
    usuarios.vetUser.id,
    roles.allRoles.find((r) => r.nombre === 'CLEANING_STAFF').id,
  );
  await assignRolesToUsers(
    usuarios.groomerUser.id,
    roles.allRoles.find((r) => r.nombre === 'CONTENT_CREATOR').id,
  );

  // Asignar TODOS los roles al usuario admin (excepto el que ya tiene asignado)
  await assignAllRolesToAdmin(
    usuarios.adminUser.id,
    roles.allRoles.filter((r) => r.nombre !== 'ADMIN'),
  );

  // Crear categorías
  await createCategorias(adminUserId);

  // Crear estados de trámite
  await createEstadosTramite(adminUserId);

  // Crear configuraciones de aplicación
  await createConfiguracionAplicacion(adminUserId);

  // Crear FAQs
  await createFaqs(adminUserId);

  console.info('Seeding finished');
}

async function clearDatabase() {
  // Eliminar registros en orden inverso a las dependencias
  await prisma.categoria.deleteMany();
  await prisma.estadoTramite.deleteMany();
  await prisma.rolPermiso.deleteMany();
  await prisma.permiso.deleteMany();
  await prisma.usuarioRol.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.tokenTemporal.deleteMany();
  await prisma.configuracionAplicacion.deleteMany();
  await prisma.usuario.deleteMany();
}

async function createRoles(userId: string) {
  const roles = [
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema', userCreateId: userId },
    { nombre: 'CLIENT', descripcion: 'Cliente del sistema', userCreateId: userId },
    { nombre: 'MANAGER', descripcion: 'Gerente de sucursal', userCreateId: userId },
    { nombre: 'CLEANING_STAFF', descripcion: 'Personal de limpieza', userCreateId: userId },
    { nombre: 'CONTENT_CREATOR', descripcion: 'Creador de contenido', userCreateId: userId },
  ];

  const createdRoles = [];

  for (const role of roles) {
    const createdRole = await prisma.rol.create({
      data: role,
    });
    createdRoles.push(createdRole);
  }

  const adminRole = createdRoles.find((r) => r.nombre === 'ADMIN');
  const clientRole = createdRoles.find((r) => r.nombre === 'CLIENT');

  return { adminRole, clientRole, allRoles: createdRoles };
}

async function createPermisos() {
  // Elimina todos los permisos existentes y crea solo los definidos en permisos.data.ts
  await prisma.permiso.deleteMany();
  // Permiso model doesn't have userCreateId field, only userUpdateId
  await prisma.permiso.createMany({ data: permisosSeed });
  return await prisma.permiso.findMany();
}

async function assignPermisosToRoles(roleIds: number[]) {
  const permisos = await prisma.permiso.findMany();

  // Asignar permisos a los roles especificados usando createMany para mejor rendimiento
  const rolPermisosData = [];
  for (const roleId of roleIds) {
    for (const permiso of permisos) {
      rolPermisosData.push({
        rolId: roleId,
        permisoId: permiso.id,
      });
    }
  }

  // Insertar todos los registros de una vez
  await prisma.rolPermiso.createMany({
    data: rolPermisosData,
    skipDuplicates: true,
  });

  console.info(`Assigned ${rolPermisosData.length} permissions to ${roleIds.length} roles`);
}

async function createUsuarios() {
  const password = await bcrypt.hash('Cambiar123@', 10);
  const adminUser = await prisma.usuario.create({
    data: {
      email: 'admin@gmail.com',
      password,
      nombre: 'Admin',
      apellidos: 'Sistema',
      telefono: '12345678',
      emailVerificado: true,
    },
  });

  const clientUser = await prisma.usuario.create({
    data: {
      email: 'cliente@gmail.com',
      password,
      nombre: 'Cliente',
      apellidos: 'Ejemplo',
      telefono: '87654321',
      emailVerificado: true,
    },
  });

  const managerUser = await prisma.usuario.create({
    data: {
      email: 'gerente@gmail.com',
      password,
      nombre: 'María',
      apellidos: 'González',
      telefono: '22334477',
      emailVerificado: true,
    },
  });

  const vetUser = await prisma.usuario.create({
    data: {
      email: 'veterinario@gmail.com',
      password,
      nombre: 'Dr. Carlos',
      apellidos: 'Rodríguez',
      telefono: '22334488',
      emailVerificado: true,
    },
  });

  const groomerUser = await prisma.usuario.create({
    data: {
      email: 'peluquero@gmail.com',
      password,
      nombre: 'Ana',
      apellidos: 'Martínez',
      telefono: '22334499',
      emailVerificado: true,
    },
  });

  return { adminUser, clientUser, managerUser, vetUser, groomerUser };
}

async function assignRolesToUsers(userId: string, rolId: number) {
  await prisma.usuarioRol.create({
    data: {
      usuarioId: userId,
      rolId: rolId,
    },
  });
}

async function assignAllRolesToAdmin(userId: string, allRoles: any[]) {
  for (const role of allRoles) {
    await prisma.usuarioRol.create({
      data: {
        usuarioId: userId,
        rolId: role.id,
      },
    });
  }
}

async function createCategorias(userId: string) {
  const categorias = [
    { nombre: 'Alimentos', descripcion: 'Alimentos para mascotas', userCreateId: userId },
    { nombre: 'Accesorios', descripcion: 'Accesorios para mascotas', userCreateId: userId },
    { nombre: 'Higiene', descripcion: 'Productos de higiene para mascotas', userCreateId: userId },
    { nombre: 'Juguetes', descripcion: 'Juguetes para mascotas', userCreateId: userId },
  ];

  const categoriasCreadas = [];

  for (const categoria of categorias) {
    const categoriaCreada = await prisma.categoria.create({
      data: categoria,
    });
    categoriasCreadas.push(categoriaCreada);
  }

  return categoriasCreadas;
}

async function createEstadosTramite(userId: string) {
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

async function createConfiguracionAplicacion(userId: string) {
  const configuraciones = [
    // Configuraciones del sistema
    {
      clave: 'sistema_mantenimiento',
      valor: 'false',
      tipo: 'booleano',
      categoria: 'sistema',
      descripcion: 'Indica si el sistema está en modo mantenimiento',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'sistema_tema_color',
      valor: '#3498db',
      tipo: 'texto',
      categoria: 'apariencia',
      descripcion: 'Color principal del tema del sistema',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'sistema_nombre',
      valor: 'Notaría Digital',
      tipo: 'texto',
      categoria: 'sistema',
      descripcion: 'Nombre de la aplicación',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'sistema_version',
      valor: '1.0.0',
      tipo: 'texto',
      categoria: 'sistema',
      descripcion: 'Versión actual del sistema',
      esEditable: false,
      userCreateId: userId,
    },

    // Políticas de negocio
    {
      clave: 'politica_terminos',
      valor: '<h1>Términos y Condiciones</h1><p>Texto de términos y condiciones...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Términos y condiciones del sistema',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'politica_privacidad',
      valor: '<h1>Política de Privacidad</h1><p>Texto de política de privacidad...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Política de privacidad del sistema',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'politica_devoluciones',
      valor: '<h1>Política de Devoluciones</h1><p>Texto de política de devoluciones...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Política de devoluciones',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'politica_envios',
      valor: '<h1>Política de Envíos</h1><p>Texto de política de envíos...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Política de envíos',
      esEditable: true,
      userCreateId: userId,
    },

    // Configuraciones de email
    {
      clave: 'email_remitente',
      valor: 'no-reply@notariadigital.com',
      tipo: 'texto',
      categoria: 'emails',
      descripcion: 'Correo electrónico del remitente',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'email_bienvenida_asunto',
      valor: '¡Bienvenido a Notaría Digital!',
      tipo: 'texto',
      categoria: 'emails',
      descripcion: 'Asunto del correo de bienvenida',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'email_bienvenida_cuerpo',
      valor: '<p>Hola {nombre}, gracias por registrarte en nuestra plataforma...</p>',
      tipo: 'html',
      categoria: 'emails',
      descripcion: 'Cuerpo del correo de bienvenida',
      esEditable: true,
      userCreateId: userId,
    },

    // Configuraciones de seguridad
    {
      clave: 'seguridad_max_intentos_login',
      valor: '5',
      tipo: 'numero',
      categoria: 'seguridad',
      descripcion: 'Máximo número de intentos de inicio de sesión fallidos',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'seguridad_bloqueo_tiempo',
      valor: '15',
      tipo: 'numero',
      categoria: 'seguridad',
      descripcion: 'Tiempo de bloqueo en minutos tras intentos fallidos',
      esEditable: true,
      userCreateId: userId,
    },

    // Configuraciones de apariencia
    {
      clave: 'apariencia_logo',
      valor: '/assets/logo.png',
      tipo: 'texto',
      categoria: 'apariencia',
      descripcion: 'URL del logo del sistema',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'apariencia_favicon',
      valor: '/assets/favicon.ico',
      tipo: 'texto',
      categoria: 'apariencia',
      descripcion: 'URL del favicon del sistema',
      esEditable: true,
      userCreateId: userId,
    },

    // Configuraciones de contacto/negocio
    {
      clave: 'contacto_email',
      valor: 'soporte@notariadigital.com',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Correo de contacto del sistema',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'contacto_telefono',
      valor: '+591 76543210',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Teléfono de contacto del sistema',
      esEditable: true,
      userCreateId: userId,
    },

    // Configuraciones de horarios
    {
      clave: 'horario_lunes_viernes',
      valor: '08:00-18:00',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Horario de atención de lunes a viernes',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'horario_sabado',
      valor: '09:00-13:00',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Horario de atención los sábados',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'horario_domingo',
      valor: 'Cerrado',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Horario de atención los domingos',
      esEditable: true,
      userCreateId: userId,
    },
  ];

  await prisma.configuracionAplicacion.createMany({
    data: configuraciones,
  });

  console.info(`Created ${configuraciones.length} configuraciones de aplicación`);
}

async function createFaqs(userId: string) {
  const faqs = [
    {
      clave: 'faq_documentos_escritura',
      valor: JSON.stringify({
        pregunta: '¿Cuáles son los documentos necesarios para una escritura pública?',
        respuesta:
          'Para realizar una escritura pública necesita: documento de identidad vigente (CI o pasaporte), títulos de propiedad originales, certificados de gravámenes actualizados, formularios de pago de impuestos y una declaración jurada de solvencia fiscal. Dependiendo del tipo de trámite, podrían requerirse documentos adicionales.',
        categoria: 'Trámites Notariales',
        orden: 1,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Cuáles son los documentos necesarios para una escritura pública?',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'faq_tiempo_legalizacion',
      valor: JSON.stringify({
        pregunta: '¿Cuánto tiempo tarda el proceso de legalización de documentos?',
        respuesta:
          'El tiempo varía según el tipo de documento. Documentos simples se procesan en 24-48 horas hábiles. Documentos internacionales o con apostilla pueden tardar de 5 a 10 días hábiles. Ofrecemos servicio express con un cargo adicional que reduce el tiempo a la mitad.',
        categoria: 'Tiempos y Plazos',
        orden: 2,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Cuánto tiempo tarda el proceso de legalización de documentos?',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'faq_costos_servicios',
      valor: JSON.stringify({
        pregunta: '¿Cuáles son los costos de los servicios notariales?',
        respuesta:
          'Los costos varían según el tipo de servicio. Certificaciones simples desde 50 Bs., autenticaciones de firmas desde 80 Bs., protocolización de contratos desde 300 Bs. Los costos exactos dependen de la complejidad del documento y se informan al momento de la consulta. Aceptamos efectivo, QR y transferencias.',
        categoria: 'Costos y Pagos',
        orden: 3,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Cuáles son los costos de los servicios notariales?',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'faq_agendar_cita',
      valor: JSON.stringify({
        pregunta: '¿Necesito agendar una cita previa?',
        respuesta:
          'Recomendamos agendar cita para trámites complejos como escrituras públicas, poderes especiales o testamentos. Para servicios simples como certificaciones puede acercarse en horario de atención. Reserve su cita a través de nuestro sistema en línea, por teléfono o WhatsApp. Las consultas iniciales son gratuitas.',
        categoria: 'Atención al Cliente',
        orden: 4,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Necesito agendar una cita previa?',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'faq_poder_notarial',
      valor: JSON.stringify({
        pregunta: '¿Qué es un poder notarial y cuándo lo necesito?',
        respuesta:
          'Un poder notarial es un documento legal que autoriza a otra persona a actuar en su nombre. Se necesita para realizar trámites en su ausencia, gestionar propiedades, representación legal, operaciones bancarias o trámites ante instituciones. Existen poderes generales y especiales según el alcance de las facultades otorgadas.',
        categoria: 'Trámites Notariales',
        orden: 5,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Qué es un poder notarial y cuándo lo necesito?',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'faq_documentos_internacional',
      valor: JSON.stringify({
        pregunta: '¿Puedo legalizar documentos para uso internacional?',
        respuesta:
          'Sí, realizamos legalización de documentos para uso internacional mediante el proceso de apostilla del Convenio de La Haya. Esto permite que sus documentos sean reconocidos en más de 100 países. El proceso incluye certificación notarial, legalización en el Ministerio de Relaciones Exteriores y apostilla final.',
        categoria: 'Trámites Internacionales',
        orden: 6,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Puedo legalizar documentos para uso internacional?',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'faq_validez_documento',
      valor: JSON.stringify({
        pregunta: '¿Qué validez tiene un documento notariado?',
        respuesta:
          'Los documentos notariados tienen validez legal permanente mientras no sean revocados o modificados. Sin embargo, algunos documentos como certificados de solvencia fiscal o antecedentes tienen período de vigencia específico según la institución que los solicita. Le recomendamos verificar los requisitos específicos de la entidad ante la cual presentará el documento.',
        categoria: 'Validez Legal',
        orden: 7,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Qué validez tiene un documento notariado?',
      esEditable: true,
      userCreateId: userId,
    },
    {
      clave: 'faq_asesoria_legal',
      valor: JSON.stringify({
        pregunta: '¿Ofrecen asesoría legal gratuita?',
        respuesta:
          'Sí, ofrecemos consultas iniciales gratuitas de 15 minutos para orientarle sobre el trámite que necesita. Nuestro personal especializado le informará sobre los documentos requeridos, costos estimados y tiempos de proceso. Para asesorías legales más extensas o complejas, contamos con tarifas preferenciales.',
        categoria: 'Atención al Cliente',
        orden: 8,
        estaActiva: true,
      }),
      tipo: 'json',
      categoria: 'faqs',
      descripcion: '¿Ofrecen asesoría legal gratuita?',
      esEditable: true,
      userCreateId: userId,
    },
  ];

  await prisma.configuracionAplicacion.createMany({
    data: faqs,
  });

  console.info(`Created ${faqs.length} FAQs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
