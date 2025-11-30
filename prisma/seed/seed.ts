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
    roles.allRoles.find((r) => r.nombre === 'VETERINARIAN').id,
  );
  await assignRolesToUsers(
    usuarios.groomerUser.id,
    roles.allRoles.find((r) => r.nombre === 'GROOMER').id,
  );

  // Asignar TODOS los roles al usuario admin (excepto el que ya tiene asignado)
  await assignAllRolesToAdmin(
    usuarios.adminUser.id,
    roles.allRoles.filter((r) => r.nombre !== 'ADMIN'),
  );

  // Crear categorías
  await createCategorias();

  // Crear tipos de productos
  await createTiposProducto();

  // Crear información de tienda

  // Crear productos ficticios
  const categorias = await prisma.categoria.findMany();
  const tiposProducto = await prisma.tipoProducto.findMany();

  console.info('Seeding finished');
}

async function clearDatabase() {
  // Eliminar registros en orden inverso a las dependencias
  await prisma.categoria.deleteMany();
  await prisma.tipoProducto.deleteMany();
  await prisma.rolPermiso.deleteMany();
  await prisma.permiso.deleteMany();
  await prisma.usuarioRol.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.usuario.deleteMany();
}

async function createRoles() {
  const roles = [
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
    { nombre: 'CLIENT', descripcion: 'Cliente del sistema' },
    { nombre: 'MANAGER', descripcion: 'Gerente de sucursal' },
    { nombre: 'EMPLOYEE', descripcion: 'Empleado general' },
    { nombre: 'VETERINARIAN', descripcion: 'Veterinario' },
    { nombre: 'CLEANING_STAFF', descripcion: 'Personal de limpieza' },
    { nombre: 'PET_TRAINER', descripcion: 'Entrenador de mascotas' },
    { nombre: 'PET_SITTER', descripcion: 'Cuidador de mascotas' },
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

async function createTiposProducto() {
  const tipos = [
    { nombre: 'Perros' },
    { nombre: 'Gatos' },
    { nombre: 'Aves' },
    { nombre: 'Peces' },
  ];

  const tiposCreados = [];

  for (const tipo of tipos) {
    const tipoCreado = await prisma.tipoProducto.create({
      data: tipo,
    });
    tiposCreados.push(tipoCreado);
  }

  return tiposCreados;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
