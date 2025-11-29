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

  {
    nombre: PermisoEnum.PRODUCTOS_VER,
    descripcion: 'Permite ver productos',
    modulo: 'productos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.PRODUCTOS_CREAR,
    descripcion: 'Permite crear productos',
    modulo: 'productos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.PRODUCTOS_EDITAR,
    descripcion: 'Permite editar productos',
    modulo: 'productos',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.PRODUCTOS_ELIMINAR,
    descripcion: 'Permite eliminar productos',
    modulo: 'productos',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.IMAGENES_PRODUCTO_CREAR,
    descripcion: 'Permite crear imágenes de producto',
    modulo: 'imagenes_producto',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.IMAGENES_PRODUCTO_EDITAR,
    descripcion: 'Permite editar imágenes de producto',
    modulo: 'imagenes_producto',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.IMAGENES_PRODUCTO_ELIMINAR,
    descripcion: 'Permite eliminar imágenes de producto',
    modulo: 'imagenes_producto',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.INVENTARIOS_EDITAR,
    descripcion: 'Permite editar inventarios',
    modulo: 'inventarios',
    accion: 'actualizar',
  },

  // ==========================
  // Admin - Sucursales y Horarios
  // ==========================
  {
    nombre: PermisoEnum.SUCURSALES_VER,
    descripcion: 'Permite ver sucursales',
    modulo: 'sucursales',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.SUCURSALES_CREAR,
    descripcion: 'Permite crear sucursales',
    modulo: 'sucursales',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.SUCURSALES_EDITAR,
    descripcion: 'Permite editar sucursales',
    modulo: 'sucursales',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.SUCURSALES_ELIMINAR,
    descripcion: 'Permite eliminar sucursales',
    modulo: 'sucursales',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.HORARIOS_VER,
    descripcion: 'Permite ver horarios',
    modulo: 'horarios',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.HORARIOS_CREAR,
    descripcion: 'Permite crear horarios',
    modulo: 'horarios',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.HORARIOS_EDITAR,
    descripcion: 'Permite editar horarios',
    modulo: 'horarios',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.HORARIOS_ELIMINAR,
    descripcion: 'Permite eliminar horarios',
    modulo: 'horarios',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Servicios informativos
  // ==========================
  {
    nombre: PermisoEnum.SERVICIOS_VER,
    descripcion: 'Permite ver servicios',
    modulo: 'servicios',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.SERVICIOS_CREAR,
    descripcion: 'Permite crear servicios',
    modulo: 'servicios',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.SERVICIOS_EDITAR,
    descripcion: 'Permite editar servicios',
    modulo: 'servicios',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.SERVICIOS_ELIMINAR,
    descripcion: 'Permite eliminar servicios',
    modulo: 'servicios',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.IMAGENES_SERVICIO_VER,
    descripcion: 'Permite ver imágenes de servicio',
    modulo: 'imagenes_servicio',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.IMAGENES_SERVICIO_CREAR,
    descripcion: 'Permite crear imágenes de servicio',
    modulo: 'imagenes_servicio',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.IMAGENES_SERVICIO_EDITAR,
    descripcion: 'Permite editar imágenes de servicio',
    modulo: 'imagenes_servicio',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.IMAGENES_SERVICIO_ELIMINAR,
    descripcion: 'Permite eliminar imágenes de servicio',
    modulo: 'imagenes_servicio',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Ventas y Entregas
  // ==========================
  {
    nombre: PermisoEnum.PEDIDOS_VER,
    descripcion: 'Permite ver pedidos',
    modulo: 'pedidos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.PEDIDOS_CREAR,
    descripcion: 'Permite crear pedidos',
    modulo: 'pedidos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.PEDIDOS_EDITAR,
    descripcion: 'Permite editar pedidos',
    modulo: 'pedidos',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.PEDIDOS_ELIMINAR,
    descripcion: 'Permite eliminar pedidos',
    modulo: 'pedidos',
    accion: 'eliminar',
  },
  {
    nombre: PermisoEnum.PEDIDOS_CAMBIAR_ESTADO,
    descripcion: 'Permite cambiar estado de pedidos',
    modulo: 'pedidos',
    accion: 'cambiar_estado',
  },

  {
    nombre: PermisoEnum.ENTREGAS_VER,
    descripcion: 'Permite ver entregas',
    modulo: 'entregas',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.ENTREGAS_CREAR,
    descripcion: 'Permite crear entregas',
    modulo: 'entregas',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.ENTREGAS_EDITAR,
    descripcion: 'Permite editar entregas',
    modulo: 'entregas',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.ENTREGAS_ELIMINAR,
    descripcion: 'Permite eliminar entregas',
    modulo: 'entregas',
    accion: 'eliminar',
  },
  {
    nombre: PermisoEnum.ENTREGAS_CAMBIAR_ESTADO,
    descripcion: 'Permite cambiar estado de entregas',
    modulo: 'entregas',
    accion: 'cambiar_estado',
  },

  // ==========================
  // Admin - Reservas
  // ==========================
  {
    nombre: PermisoEnum.RESERVAS_VER,
    descripcion: 'Permite ver reservas',
    modulo: 'reservas',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.RESERVAS_EDITAR,
    descripcion: 'Permite editar reservas',
    modulo: 'reservas',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.RESERVAS_ELIMINAR,
    descripcion: 'Permite eliminar reservas',
    modulo: 'reservas',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Contacto y Mensajes
  // ==========================
  {
    nombre: PermisoEnum.CONTACTO_VER,
    descripcion: 'Permite ver mensajes de contacto',
    modulo: 'contacto',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CONTACTO_EDITAR,
    descripcion: 'Permite editar mensajes de contacto',
    modulo: 'contacto',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.CONTACTO_ELIMINAR,
    descripcion: 'Permite eliminar mensajes de contacto',
    modulo: 'contacto',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Reseñas
  // ==========================
  {
    nombre: PermisoEnum.RESENIAS_VER,
    descripcion: 'Permite ver reseñas',
    modulo: 'resenias',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.RESENIAS_CREAR,
    descripcion: 'Permite crear reseñas',
    modulo: 'resenias',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.RESENIAS_EDITAR,
    descripcion: 'Permite editar reseñas',
    modulo: 'resenias',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.RESENIAS_ELIMINAR,
    descripcion: 'Permite eliminar reseñas',
    modulo: 'resenias',
    accion: 'eliminar',
  },
  {
    nombre: PermisoEnum.RESENIAS_MODERAR,
    descripcion: 'Permite moderar reseñas',
    modulo: 'resenias',
    accion: 'moderar',
  },

  // ==========================
  // Cliente - Catálogo y navegación
  // ==========================
  {
    nombre: PermisoEnum.CLIENTE_CATEGORIAS_VER,
    descripcion: 'Cliente: ver categorías',
    modulo: 'cliente_categorias',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CLIENTE_PRODUCTOS_VER,
    descripcion: 'Cliente: ver productos',
    modulo: 'cliente_productos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CLIENTE_SERVICIOS_VER,
    descripcion: 'Cliente: ver servicios',
    modulo: 'cliente_servicios',
    accion: 'ver',
  },

  // ==========================
  // Cliente - Perfil y seguridad
  // ==========================
  {
    nombre: PermisoEnum.CLIENTE_PERFIL_VER,
    descripcion: 'Cliente: ver perfil',
    modulo: 'cliente_perfil',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CLIENTE_PERFIL_EDITAR,
    descripcion: 'Cliente: editar perfil',
    modulo: 'cliente_perfil',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.CLIENTE_CAMBIAR_PASSWORD,
    descripcion: 'Cliente: cambiar contraseña',
    modulo: 'cliente_perfil',
    accion: 'cambiar_password',
  },

  // ==========================
  // Cliente - Carrito
  // ==========================
  {
    nombre: PermisoEnum.CLIENTE_CARRITO_VER,
    descripcion: 'Cliente: ver carrito',
    modulo: 'cliente_carrito',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CLIENTE_CARRITO_AGREGAR,
    descripcion: 'Cliente: agregar al carrito',
    modulo: 'cliente_carrito',
    accion: 'agregar',
  },
  {
    nombre: PermisoEnum.CLIENTE_CARRITO_ACTUALIZAR,
    descripcion: 'Cliente: actualizar carrito',
    modulo: 'cliente_carrito',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.CLIENTE_CARRITO_ELIMINAR,
    descripcion: 'Cliente: eliminar del carrito',
    modulo: 'cliente_carrito',
    accion: 'eliminar',
  },

  // ==========================
  // Cliente - Reservas
  // ==========================
  {
    nombre: PermisoEnum.CLIENTE_RESERVAS_VER,
    descripcion: 'Cliente: ver reservas',
    modulo: 'cliente_reservas',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CLIENTE_RESERVAS_CREAR,
    descripcion: 'Cliente: crear reservas',
    modulo: 'cliente_reservas',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.CLIENTE_RESERVAS_CANCELAR,
    descripcion: 'Cliente: cancelar reservas',
    modulo: 'cliente_reservas',
    accion: 'cancelar',
  },

  // ==========================
  // Cliente - Pedidos y compras
  // ==========================
  {
    nombre: PermisoEnum.CLIENTE_PEDIDOS_VER,
    descripcion: 'Cliente: ver pedidos',
    modulo: 'cliente_pedidos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CLIENTE_PEDIDOS_CREAR,
    descripcion: 'Cliente: crear pedidos',
    modulo: 'cliente_pedidos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.CLIENTE_PEDIDOS_CANCELAR,
    descripcion: 'Cliente: cancelar pedidos',
    modulo: 'cliente_pedidos',
    accion: 'cancelar',
  },
  {
    nombre: PermisoEnum.CLIENTE_ENTREGAS_VER,
    descripcion: 'Cliente: ver entregas',
    modulo: 'cliente_entregas',
    accion: 'ver',
  },

  // ==========================
  // Cliente - Reseñas y contacto
  // ==========================
  {
    nombre: PermisoEnum.CLIENTE_RESENIAS_CREAR,
    descripcion: 'Cliente: crear reseñas',
    modulo: 'cliente_resenias',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.CLIENTE_RESENIAS_EDITAR,
    descripcion: 'Cliente: editar reseñas',
    modulo: 'cliente_resenias',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.CLIENTE_RESENIAS_ELIMINAR,
    descripcion: 'Cliente: eliminar reseñas',
    modulo: 'cliente_resenias',
    accion: 'eliminar',
  },
  {
    nombre: PermisoEnum.CLIENTE_CONTACTO_CREAR,
    descripcion: 'Cliente: crear contacto',
    modulo: 'cliente_contacto',
    accion: 'crear',
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
