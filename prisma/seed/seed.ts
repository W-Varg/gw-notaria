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

  // Crear roles básicos
  const roles = await createRoles();
  console.info(`Created ${roles.allRoles.length} roles`);

  // Crear permisos
  await createPermisos();

  // Asignar permisos a roles
  await assignPermisosToRoles(roles.allRoles.map((r) => r.id));

  // Crear usuarios
  const usuarios = await createUsuarios();

  // Asignar roles a usuarios
  await assignRolesToUsers(usuarios.adminUser.id, roles.adminRole.id);
  await assignRolesToUsers(usuarios.clientUser.id, roles.clientRole.id);
  await assignRolesToUsers(
    usuarios.managerUser.id,
    roles.allRoles.find((r) => r.nombre === 'MANAGER').id,
  );
  await assignRolesToUsers(
    usuarios.vetUser.id,
    roles.allRoles.find((r) => r.nombre === 'EMPLOYEE').id,
  );

  // Asignar TODOS los roles al usuario admin (excepto el que ya tiene asignado)
  await assignAllRolesToAdmin(
    usuarios.adminUser.id,
    roles.allRoles.filter((r) => r.nombre !== 'ADMIN'),
  );

  // Crear categorías
  await createCategorias();

  // Crear configuraciones de aplicación
  await createConfiguracionAplicacion();

  console.info('Seeding finished');
}

async function clearDatabase() {
  // Eliminar registros en orden inverso a las dependencias
  await prisma.categoria.deleteMany();
  await prisma.rolPermiso.deleteMany();
  await prisma.permiso.deleteMany();
  await prisma.usuarioRol.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.tokenTemporal.deleteMany();
  await prisma.configuracionAplicacion.deleteMany();
  await prisma.usuario.deleteMany();
}

async function createRoles() {
  const roles = [
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
    { nombre: 'CLIENT', descripcion: 'Cliente del sistema' },
    { nombre: 'MANAGER', descripcion: 'Gerente de sucursal' },
    { nombre: 'EMPLOYEE', descripcion: 'Empleado general' },
    { nombre: 'CLEANING_STAFF', descripcion: 'Personal de limpieza' },
    { nombre: 'CONTENT_CREATOR', descripcion: 'Creador de contenido' },
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

async function createCategorias() {
  const categorias = [
    { nombre: 'Alimentos', descripcion: 'Alimentos para mascotas' },
    { nombre: 'Accesorios', descripcion: 'Accesorios para mascotas' },
    { nombre: 'Higiene', descripcion: 'Productos de higiene para mascotas' },
    { nombre: 'Juguetes', descripcion: 'Juguetes para mascotas' },
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

async function createConfiguracionAplicacion() {
  const configuraciones = [
    // Configuraciones del sistema
    {
      clave: 'sistema_mantenimiento',
      valor: 'false',
      tipo: 'booleano',
      categoria: 'sistema',
      descripcion: 'Indica si el sistema está en modo mantenimiento',
      esEditable: true,
    },
    {
      clave: 'sistema_tema_color',
      valor: '#3498db',
      tipo: 'texto',
      categoria: 'apariencia',
      descripcion: 'Color principal del tema del sistema',
      esEditable: true,
    },
    {
      clave: 'sistema_nombre',
      valor: 'Notaría Digital',
      tipo: 'texto',
      categoria: 'sistema',
      descripcion: 'Nombre de la aplicación',
      esEditable: true,
    },
    {
      clave: 'sistema_version',
      valor: '1.0.0',
      tipo: 'texto',
      categoria: 'sistema',
      descripcion: 'Versión actual del sistema',
      esEditable: false,
    },

    // Políticas de negocio
    {
      clave: 'politica_terminos',
      valor: '<h1>Términos y Condiciones</h1><p>Texto de términos y condiciones...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Términos y condiciones del sistema',
      esEditable: true,
    },
    {
      clave: 'politica_privacidad',
      valor: '<h1>Política de Privacidad</h1><p>Texto de política de privacidad...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Política de privacidad del sistema',
      esEditable: true,
    },
    {
      clave: 'politica_devoluciones',
      valor: '<h1>Política de Devoluciones</h1><p>Texto de política de devoluciones...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Política de devoluciones',
      esEditable: true,
    },
    {
      clave: 'politica_envios',
      valor: '<h1>Política de Envíos</h1><p>Texto de política de envíos...</p>',
      tipo: 'html',
      categoria: 'politicas',
      descripcion: 'Política de envíos',
      esEditable: true,
    },

    // Configuraciones de email
    {
      clave: 'email_remitente',
      valor: 'no-reply@notariadigital.com',
      tipo: 'texto',
      categoria: 'emails',
      descripcion: 'Correo electrónico del remitente',
      esEditable: true,
    },
    {
      clave: 'email_bienvenida_asunto',
      valor: '¡Bienvenido a Notaría Digital!',
      tipo: 'texto',
      categoria: 'emails',
      descripcion: 'Asunto del correo de bienvenida',
      esEditable: true,
    },
    {
      clave: 'email_bienvenida_cuerpo',
      valor: '<p>Hola {nombre}, gracias por registrarte en nuestra plataforma...</p>',
      tipo: 'html',
      categoria: 'emails',
      descripcion: 'Cuerpo del correo de bienvenida',
      esEditable: true,
    },

    // Configuraciones de seguridad
    {
      clave: 'seguridad_max_intentos_login',
      valor: '5',
      tipo: 'numero',
      categoria: 'seguridad',
      descripcion: 'Máximo número de intentos de inicio de sesión fallidos',
      esEditable: true,
    },
    {
      clave: 'seguridad_bloqueo_tiempo',
      valor: '15',
      tipo: 'numero',
      categoria: 'seguridad',
      descripcion: 'Tiempo de bloqueo en minutos tras intentos fallidos',
      esEditable: true,
    },

    // Configuraciones de apariencia
    {
      clave: 'apariencia_logo',
      valor: '/assets/logo.png',
      tipo: 'texto',
      categoria: 'apariencia',
      descripcion: 'URL del logo del sistema',
      esEditable: true,
    },
    {
      clave: 'apariencia_favicon',
      valor: '/assets/favicon.ico',
      tipo: 'texto',
      categoria: 'apariencia',
      descripcion: 'URL del favicon del sistema',
      esEditable: true,
    },

    // Configuraciones de contacto/negocio
    {
      clave: 'contacto_email',
      valor: 'soporte@notariadigital.com',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Correo de contacto del sistema',
      esEditable: true,
    },
    {
      clave: 'contacto_telefono',
      valor: '+591 76543210',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Teléfono de contacto del sistema',
      esEditable: true,
    },

    // Configuraciones de horarios
    {
      clave: 'horario_lunes_viernes',
      valor: '08:00-18:00',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Horario de atención de lunes a viernes',
      esEditable: true,
    },
    {
      clave: 'horario_sabado',
      valor: '09:00-13:00',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Horario de atención los sábados',
      esEditable: true,
    },
    {
      clave: 'horario_domingo',
      valor: 'Cerrado',
      tipo: 'texto',
      categoria: 'negocio',
      descripcion: 'Horario de atención los domingos',
      esEditable: true,
    },
  ];

  await prisma.configuracionAplicacion.createMany({
    data: configuraciones,
  });

  console.info(`Created ${configuraciones.length} configuraciones de aplicación`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
