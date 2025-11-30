import { Prisma } from 'src/generated/prisma/client';
import { PermisoEnum } from '../../../../enums/permisos.enum';

// Definición de los permisos estáticos, con descripciones y metadatos
// NOTA: El campo 'nivel' se deja en 0 por defecto, puedes ajustar según necesidades.
export const permisos: Prisma.PermisoUncheckedCreateInput[] = [
  // ==========================
  // Admin - Seguridad
  // ==========================
  {
    nombre: PermisoEnum.USUARIOS_VER,
    descripcion: 'Permite ver la lista de usuarios',
    modulo: 'usuarios',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.USUARIOS_CREAR,
    descripcion: 'Permite crear usuarios',
    modulo: 'usuarios',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.USUARIOS_EDITAR,
    descripcion: 'Permite editar usuarios',
    modulo: 'usuarios',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.USUARIOS_EDITAR_CONTRASENIA,
    descripcion: 'Permite editar la contraseña de usuarios',
    modulo: 'usuarios',
    accion: 'editar_contrasenia',
  },
  {
    nombre: PermisoEnum.USUARIOS_ELIMINAR,
    descripcion: 'Permite eliminar usuarios',
    modulo: 'usuarios',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.ROLES_VER,
    descripcion: 'Permite ver roles',
    modulo: 'roles',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.ROLES_CREAR,
    descripcion: 'Permite crear roles',
    modulo: 'roles',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.ROLES_EDITAR,
    descripcion: 'Permite editar roles',
    modulo: 'roles',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.ROLES_ELIMINAR,
    descripcion: 'Permite eliminar roles',
    modulo: 'roles',
    accion: 'eliminar',
  },
  {
    nombre: PermisoEnum.ROLES_ASIGNAR_PERMISOS,
    descripcion: 'Permite asignar permisos a roles',
    modulo: 'roles',
    accion: 'asignar_permisos',
  },

  {
    nombre: PermisoEnum.PERMISOS_VER,
    descripcion: 'Permite ver permisos',
    modulo: 'permisos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.PERMISOS_CREAR,
    descripcion: 'Permite crear permisos',
    modulo: 'permisos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.PERMISOS_EDITAR,
    descripcion: 'Permite editar permisos',
    modulo: 'permisos',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.PERMISOS_ELIMINAR,
    descripcion: 'Permite eliminar permisos',
    modulo: 'permisos',
    accion: 'eliminar',
  },
  {
    nombre: PermisoEnum.EMPLEADOS_VER,
    descripcion: 'Permite ver empleados',
    modulo: 'empleados',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.EMPLEADOS_CREAR,
    descripcion: 'Permite crear empleados',
    modulo: 'empleados',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.EMPLEADOS_EDITAR,
    descripcion: 'Permite editar empleados',
    modulo: 'empleados',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.EMPLEADOS_ELIMINAR,
    descripcion: 'Permite eliminar empleados',
    modulo: 'empleados',
    accion: 'eliminar',
  },
  {
    nombre: PermisoEnum.EMPLEADOS_ASIGNAR_SUCURSAL,
    descripcion: 'Permite asignar sucursal a empleados',
    modulo: 'empleados',
    accion: 'asignar_sucursal',
  },

  // ==========================
  // Admin - Catálogo
  // ==========================
  {
    nombre: PermisoEnum.CATEGORIAS_VER,
    descripcion: 'Permite ver categorías',
    modulo: 'categorias',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CATEGORIAS_CREAR,
    descripcion: 'Permite crear categorías',
    modulo: 'categorias',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.CATEGORIAS_EDITAR,
    descripcion: 'Permite editar categorías',
    modulo: 'categorias',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.CATEGORIAS_ELIMINAR,
    descripcion: 'Permite eliminar categorías',
    modulo: 'categorias',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.TIPOS_PRODUCTO_VER,
    descripcion: 'Permite ver tipos de producto',
    modulo: 'tipos_producto',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.TIPOS_PRODUCTO_CREAR,
    descripcion: 'Permite crear tipos de producto',
    modulo: 'tipos_producto',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.TIPOS_PRODUCTO_EDITAR,
    descripcion: 'Permite editar tipos de producto',
    modulo: 'tipos_producto',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.TIPOS_PRODUCTO_ELIMINAR,
    descripcion: 'Permite eliminar tipos de producto',
    modulo: 'tipos_producto',
    accion: 'eliminar',
  },

  /* ------------------------------------------------------------------------------------------------------------------ */
  /*                                                 modulo de reportes                                                 */
  /* ------------------------------------------------------------------------------------------------------------------ */
  {
    nombre: PermisoEnum.REPORTES_VER,
    descripcion: 'Permite ver y generar reportes',
    modulo: 'reportes',
    accion: 'ver',
  },
];
