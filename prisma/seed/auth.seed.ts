import { PrismaClient } from '../../src/generated/prisma/client';
import { permisos as permisosSeed } from '../../src/modules/admin/security/permisos/permisos.data';
import * as bcrypt from 'bcrypt';

export async function createRoles(prisma: PrismaClient, userId: string) {
  const roles = [
    {
      nombre: 'SUPERUSUARIO',
      descripcion: 'Super usuario con todos los permisos del sistema',
      userCreateId: userId,
    },
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema', userCreateId: userId },
    { nombre: 'CLIENT', descripcion: 'Cliente del sistema', userCreateId: userId },
    { nombre: 'MANAGER', descripcion: 'Gerente de sucursal', userCreateId: userId },
    { nombre: 'NOTARIO', descripcion: 'Notario de fe pública', userCreateId: userId },
    { nombre: 'ASISTENTE', descripcion: 'Asistente administrativo', userCreateId: userId },
  ];

  const createdRoles = [];

  for (const role of roles) {
    const createdRole = await prisma.rol.create({
      data: role,
    });
    createdRoles.push(createdRole);
  }

  const superusuarioRole = createdRoles.find((r) => r.nombre === 'SUPERUSUARIO');
  const adminRole = createdRoles.find((r) => r.nombre === 'ADMIN');
  const clientRole = createdRoles.find((r) => r.nombre === 'CLIENT');

  console.info(`Created ${createdRoles.length} roles`);
  return { superusuarioRole, adminRole, clientRole, allRoles: createdRoles };
}

export async function createPermisos(prisma: PrismaClient) {
  // Elimina todos los permisos existentes y crea solo los definidos en permisos.data.ts
  await prisma.permiso.deleteMany();
  await prisma.permiso.createMany({ data: permisosSeed });
  const permisos = await prisma.permiso.findMany();
  console.info(`Created ${permisos.length} permisos`);
  return permisos;
}

export async function assignPermisosToRoles(prisma: PrismaClient, roleIds: number[]) {
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

export async function createUsuarios(prisma: PrismaClient, sucursales: any[]) {
  const password = await bcrypt.hash('Cambiar123@', 10);

  const adminUser = await prisma.usuario.create({
    data: {
      email: 'admin@gmail.com',
      password,
      nombre: 'Super',
      apellidos: 'Administrador',
      telefono: '12345678',
      emailVerificado: true,
      sucursalId: sucursales[0]?.id, // Asignar a Santa Cruz
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
      sucursalId: sucursales[0]?.id, // Santa Cruz
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
      sucursalId: sucursales[0]?.id, // Santa Cruz
    },
  });

  const notarioUser = await prisma.usuario.create({
    data: {
      email: 'notario@gmail.com',
      password,
      nombre: 'Dr. Carlos',
      apellidos: 'Rodríguez',
      telefono: '22334488',
      emailVerificado: true,
      sucursalId: sucursales[1]?.id, // Cochabamba
    },
  });

  const asistenteUser = await prisma.usuario.create({
    data: {
      email: 'asistente@gmail.com',
      password,
      nombre: 'Ana',
      apellidos: 'Martínez',
      telefono: '22334499',
      emailVerificado: true,
      sucursalId: sucursales[1]?.id, // Cochabamba
    },
  });

  console.info(`Created ${5} usuarios`);
  return { adminUser, clientUser, managerUser, notarioUser, asistenteUser };
}

export async function assignRolesToUsers(prisma: PrismaClient, userId: string, rolId: number) {
  await prisma.usuarioRol.create({
    data: {
      usuarioId: userId,
      rolId: rolId,
    },
  });
}

export async function assignAllRolesToAdmin(prisma: PrismaClient, userId: string, allRoles: any[]) {
  for (const role of allRoles) {
    await prisma.usuarioRol.create({
      data: {
        usuarioId: userId,
        rolId: role.id,
      },
    });
  }
  console.info(`Assigned all ${allRoles.length} roles to superusuario`);
}
