import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { crearGastos } from './gastos.seed';
import { crearPagosIngresos } from './pagos-ingresos.seed';
import {
  createUsuarios,
  createRoles,
  createPermisos,
  assignPermisosToRoles,
  assignRolesToUsers,
  assignAllRolesToAdmin,
} from './auth.seed';
import {
  createSucursales,
  createTiposTramite,
  createBancos,
  createCuentasBancarias,
  createTiposDocumento,
  createEstadosTramite,
} from './catalogos.seed';
import {
  crearClientes,
  crearServicios,
  crearHistorialEstados,
  crearResponsables,
  crearDerivaciones,
} from './clientes-servicios.seed';
import { crearComercializadoras } from './comercializadoras.seed';
import {
  crearNotificaciones,
  crearMensajesContacto,
} from './notificaciones-mensajes.seed';
import {
  crearPlantillasDocumento,
  crearTransaccionesEgresos,
  crearArqueosDiarios,
} from './plantillas-finanzas.seed';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar la base de datos
  await clearDatabase();

  // Crear sucursales temporalmente para asignar a usuarios
  const sucursalesTemp = await createSucursales(prisma, 'temp-user-id');

  // Crear usuarios primero para obtener el ID del admin
  const usuarios = await createUsuarios(prisma, sucursalesTemp);
  const adminUserId = usuarios.adminUser.id;

  // Actualizar sucursales con el userCreateId correcto y responsables
  await prisma.sucursal.updateMany({
    where: { userCreateId: 'temp-user-id' },
    data: { userCreateId: adminUserId },
  });
  
  // Asignar responsables a sucursales
  await prisma.sucursal.update({
    where: { id: sucursalesTemp[0].id },
    data: { usuarioResponsableId: usuarios.managerUser.id },
  });
  await prisma.sucursal.update({
    where: { id: sucursalesTemp[1].id },
    data: { usuarioResponsableId: usuarios.notarioUser.id },
  });

  const sucursales = sucursalesTemp;

  // Crear roles básicos (incluye SUPERUSUARIO)
  const roles = await createRoles(prisma, adminUserId);

  // Crear permisos
  await createPermisos(prisma);

  // Asignar TODOS los permisos al rol SUPERUSUARIO
  await assignPermisosToRoles(prisma, [roles.superusuarioRole.id]);

  // Asignar permisos limitados a otros roles
  await assignPermisosToRoles(prisma, [roles.adminRole.id]);

  // Asignar rol SUPERUSUARIO al usuario admin@gmail.com
  await assignRolesToUsers(prisma, usuarios.adminUser.id, roles.superusuarioRole.id);

  // Asignar roles a otros usuarios
  await assignRolesToUsers(prisma, usuarios.clientUser.id, roles.clientRole.id);
  await assignRolesToUsers(
    prisma,
    usuarios.managerUser.id,
    roles.allRoles.find((r) => r.nombre === 'MANAGER').id,
  );
  await assignRolesToUsers(
    prisma,
    usuarios.notarioUser.id,
    roles.allRoles.find((r) => r.nombre === 'NOTARIO').id,
  );
  await assignRolesToUsers(
    prisma,
    usuarios.asistenteUser.id,
    roles.allRoles.find((r) => r.nombre === 'ASISTENTE').id,
  );

  // Crear bancos
  const bancos = await createBancos(prisma, adminUserId);

  // Crear cuentas bancarias
  const cuentasBancarias = await createCuentasBancarias(prisma, adminUserId, bancos);

  // Crear tipos de documento
  const tiposDocumento = await createTiposDocumento(prisma, adminUserId);

  // Crear tipos de trámite
  const tiposTramite = await createTiposTramite(prisma, adminUserId, tiposDocumento, sucursales);

  // Crear estados de trámite
  const estadosTramite = await createEstadosTramite(prisma, adminUserId);

  // Crear configuraciones de aplicación
  await createConfiguracionAplicacion(adminUserId);

  // Crear FAQs
  await createFaqs(adminUserId);

  // Crear clientes (personas naturales y jurídicas)
  const clientes = await crearClientes(prisma, adminUserId);
  const clientesArray = Object.values(clientes);

  // Crear comercializadoras
  const comercializadoras = await crearComercializadoras(prisma, adminUserId, clientesArray, sucursales);

  // Crear servicios
  const servicios = await crearServicios(
    prisma,
    adminUserId,
    clientes,
    tiposDocumento,
    tiposTramite,
    estadosTramite,
    usuarios,
    sucursales,
  );

  // Crear historial de estados de los servicios
  await crearHistorialEstados(prisma, servicios, estadosTramite, usuarios);

  // Crear responsables de servicios
  await crearResponsables(prisma, servicios, usuarios);

  // Crear derivaciones entre usuarios
  await crearDerivaciones(prisma, servicios, usuarios);

  // Crear gastos
  const gastos = await crearGastos(prisma, adminUserId);

  // Crear pagos e ingresos
  await crearPagosIngresos(prisma, adminUserId);

  // Crear transacciones de egresos
  await crearTransaccionesEgresos(prisma, gastos, cuentasBancarias);

  // Crear arqueos diarios
  await crearArqueosDiarios(prisma, adminUserId);

  // Crear plantillas de documentos
  await crearPlantillasDocumento(prisma, adminUserId, tiposDocumento);

  // Crear notificaciones
  await crearNotificaciones(prisma, adminUserId, usuarios, servicios);

  // Crear mensajes de contacto
  await crearMensajesContacto(prisma, adminUserId, usuarios);

  console.info('Seeding finished');
}

async function clearDatabase() {
  // Eliminar registros en orden inverso a las dependencias
  await prisma.transaccionesEgresos.deleteMany();
  await prisma.gastos.deleteMany();
  await prisma.pagosIngresos.deleteMany();
  await prisma.responsableServicio.deleteMany();
  await prisma.historialEstadosServicio.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.comercializadora.deleteMany();
  await prisma.personaJuridica.deleteMany();
  await prisma.personaNatural.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.plantillaDocumento.deleteMany();
  await prisma.tipoTramite.deleteMany();
  await prisma.tipoDocumento.deleteMany();
  await prisma.estadoTramite.deleteMany();
  await prisma.cuentaBancaria.deleteMany();
  await prisma.banco.deleteMany();
  await prisma.rolPermiso.deleteMany();
  await prisma.permiso.deleteMany();
  await prisma.usuarioRol.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.tokenTemporal.deleteMany();
  await prisma.configuracionAplicacion.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.contadorTicketSucursal.deleteMany();
  await prisma.sucursal.deleteMany();
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
