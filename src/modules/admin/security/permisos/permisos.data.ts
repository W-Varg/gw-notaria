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
    nombre: PermisoEnum.ELIMINAR_USUARIOS_NO_VERIFICADOS,
    descripcion: 'Permite eliminar usuarios no verificados',
    modulo: 'usuarios',
    accion: 'eliminar_no_verificados',
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
    nombre: PermisoEnum.CONFIGURACION_VER,
    descripcion: 'Permite ver configuraciones del sistema',
    modulo: 'configuracion',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CONFIGURACION_EDITAR,
    descripcion: 'Permite editar configuraciones del sistema',
    modulo: 'configuracion',
    accion: 'editar',
  },

  {
    nombre: PermisoEnum.NOTIFICACIONES_VER,
    descripcion: 'Permite ver notificaciones',
    modulo: 'notificaciones',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.NOTIFICACIONES_CREAR,
    descripcion: 'Permite crear notificaciones',
    modulo: 'notificaciones',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.NOTIFICACIONES_EDITAR,
    descripcion: 'Permite editar notificaciones',
    modulo: 'notificaciones',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.NOTIFICACIONES_ELIMINAR,
    descripcion: 'Permite eliminar notificaciones',
    modulo: 'notificaciones',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.FAQS_VER,
    descripcion: 'Permite ver preguntas frecuentes',
    modulo: 'faqs',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.FAQS_CREAR,
    descripcion: 'Permite crear preguntas frecuentes',
    modulo: 'faqs',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.FAQS_EDITAR,
    descripcion: 'Permite editar preguntas frecuentes',
    modulo: 'faqs',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.FAQS_ELIMINAR,
    descripcion: 'Permite eliminar preguntas frecuentes',
    modulo: 'faqs',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Catálogo
  // ==========================
  {
    nombre: PermisoEnum.TIPOS_TRAMITE_VER,
    descripcion: 'Permite ver tipos de trámite',
    modulo: 'tipos-tramite',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.TIPOS_TRAMITE_CREAR,
    descripcion: 'Permite crear tipos de trámite',
    modulo: 'tipos-tramite',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.TIPOS_TRAMITE_EDITAR,
    descripcion: 'Permite editar tipos de trámite',
    modulo: 'tipos-tramite',
    accion: 'actualizar',
  },
  {
    nombre: PermisoEnum.TIPOS_TRAMITE_ELIMINAR,
    descripcion: 'Permite eliminar tipos de trámite',
    modulo: 'tipos-tramite',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.BANCOS_VER,
    descripcion: 'Permite ver bancos',
    modulo: 'bancos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.BANCOS_CREAR,
    descripcion: 'Permite crear bancos',
    modulo: 'bancos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.BANCOS_EDITAR,
    descripcion: 'Permite editar bancos',
    modulo: 'bancos',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.BANCOS_ELIMINAR,
    descripcion: 'Permite eliminar bancos',
    modulo: 'bancos',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.CUENTAS_BANCARIAS_VER,
    descripcion: 'Permite ver cuentas bancarias',
    modulo: 'cuentas_bancarias',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CUENTAS_BANCARIAS_CREAR,
    descripcion: 'Permite crear cuentas bancarias',
    modulo: 'cuentas_bancarias',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.CUENTAS_BANCARIAS_EDITAR,
    descripcion: 'Permite editar cuentas bancarias',
    modulo: 'cuentas_bancarias',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.CUENTAS_BANCARIAS_ELIMINAR,
    descripcion: 'Permite eliminar cuentas bancarias',
    modulo: 'cuentas_bancarias',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.TIPOS_DOCUMENTO_VER,
    descripcion: 'Permite ver tipos de documento',
    modulo: 'tipos_documento',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.TIPOS_DOCUMENTO_CREAR,
    descripcion: 'Permite crear tipos de documento',
    modulo: 'tipos_documento',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.TIPOS_DOCUMENTO_EDITAR,
    descripcion: 'Permite editar tipos de documento',
    modulo: 'tipos_documento',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.TIPOS_DOCUMENTO_ELIMINAR,
    descripcion: 'Permite eliminar tipos de documento',
    modulo: 'tipos_documento',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.PLANTILLAS_DOCUMENTO_VER,
    descripcion: 'Permite ver plantillas de documento',
    modulo: 'plantillas_documento',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.PLANTILLAS_DOCUMENTO_CREAR,
    descripcion: 'Permite crear plantillas de documento',
    modulo: 'plantillas_documento',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.PLANTILLAS_DOCUMENTO_EDITAR,
    descripcion: 'Permite editar plantillas de documento',
    modulo: 'plantillas_documento',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.PLANTILLAS_DOCUMENTO_ELIMINAR,
    descripcion: 'Permite eliminar plantillas de documento',
    modulo: 'plantillas_documento',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.ESTADOS_TRAMITE_VER,
    descripcion: 'Permite ver estados de trámite',
    modulo: 'estados_tramite',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.ESTADOS_TRAMITE_CREAR,
    descripcion: 'Permite crear estados de trámite',
    modulo: 'estados_tramite',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.ESTADOS_TRAMITE_EDITAR,
    descripcion: 'Permite editar estados de trámite',
    modulo: 'estados_tramite',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.ESTADOS_TRAMITE_ELIMINAR,
    descripcion: 'Permite eliminar estados de trámite',
    modulo: 'estados_tramite',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Clientes
  // ==========================
  {
    nombre: PermisoEnum.CLIENTES_VER,
    descripcion: 'Permite ver clientes',
    modulo: 'clientes',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.CLIENTES_CREAR,
    descripcion: 'Permite crear clientes',
    modulo: 'clientes',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.CLIENTES_EDITAR,
    descripcion: 'Permite editar clientes',
    modulo: 'clientes',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.CLIENTES_ELIMINAR,
    descripcion: 'Permite eliminar clientes',
    modulo: 'clientes',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Servicios
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
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.SERVICIOS_ELIMINAR,
    descripcion: 'Permite eliminar servicios',
    modulo: 'servicios',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_VER,
    descripcion: 'Permite ver historial de estados de servicio',
    modulo: 'historial_estados_servicio',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_CREAR,
    descripcion: 'Permite crear registros en historial de estados de servicio',
    modulo: 'historial_estados_servicio',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_EDITAR,
    descripcion: 'Permite editar registros en historial de estados de servicio',
    modulo: 'historial_estados_servicio',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.HISTORIAL_ESTADOS_SERVICIO_ELIMINAR,
    descripcion: 'Permite eliminar registros en historial de estados de servicio',
    modulo: 'historial_estados_servicio',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.RESPONSABLES_SERVICIO_VER,
    descripcion: 'Permite ver responsables de servicio',
    modulo: 'responsables_servicio',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.RESPONSABLES_SERVICIO_CREAR,
    descripcion: 'Permite crear responsables de servicio',
    modulo: 'responsables_servicio',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.RESPONSABLES_SERVICIO_EDITAR,
    descripcion: 'Permite editar responsables de servicio',
    modulo: 'responsables_servicio',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.RESPONSABLES_SERVICIO_ELIMINAR,
    descripcion: 'Permite eliminar responsables de servicio',
    modulo: 'responsables_servicio',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Finanzas
  // ==========================
  {
    nombre: PermisoEnum.PAGOS_INGRESOS_VER,
    descripcion: 'Permite ver pagos e ingresos',
    modulo: 'pagos_ingresos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.PAGOS_INGRESOS_CREAR,
    descripcion: 'Permite crear pagos e ingresos',
    modulo: 'pagos_ingresos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.PAGOS_INGRESOS_EDITAR,
    descripcion: 'Permite editar pagos e ingresos',
    modulo: 'pagos_ingresos',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.PAGOS_INGRESOS_ELIMINAR,
    descripcion: 'Permite eliminar pagos e ingresos',
    modulo: 'pagos_ingresos',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.GASTOS_VER,
    descripcion: 'Permite ver gastos',
    modulo: 'gastos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.GASTOS_CREAR,
    descripcion: 'Permite crear gastos',
    modulo: 'gastos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.GASTOS_EDITAR,
    descripcion: 'Permite editar gastos',
    modulo: 'gastos',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.GASTOS_ELIMINAR,
    descripcion: 'Permite eliminar gastos',
    modulo: 'gastos',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.TRANSACCIONES_EGRESOS_VER,
    descripcion: 'Permite ver transacciones de egresos',
    modulo: 'transacciones_egresos',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.TRANSACCIONES_EGRESOS_CREAR,
    descripcion: 'Permite crear transacciones de egresos',
    modulo: 'transacciones_egresos',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.TRANSACCIONES_EGRESOS_EDITAR,
    descripcion: 'Permite editar transacciones de egresos',
    modulo: 'transacciones_egresos',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.TRANSACCIONES_EGRESOS_ELIMINAR,
    descripcion: 'Permite eliminar transacciones de egresos',
    modulo: 'transacciones_egresos',
    accion: 'eliminar',
  },

  {
    nombre: PermisoEnum.ARQUEOS_DIARIOS_VER,
    descripcion: 'Permite ver arqueos diarios',
    modulo: 'arqueos_diarios',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.ARQUEOS_DIARIOS_CREAR,
    descripcion: 'Permite crear arqueos diarios',
    modulo: 'arqueos_diarios',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.ARQUEOS_DIARIOS_EDITAR,
    descripcion: 'Permite editar arqueos diarios',
    modulo: 'arqueos_diarios',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.ARQUEOS_DIARIOS_ELIMINAR,
    descripcion: 'Permite eliminar arqueos diarios',
    modulo: 'arqueos_diarios',
    accion: 'eliminar',
  },

  // ==========================
  // Admin - Contacto
  // ==========================
  {
    nombre: PermisoEnum.MENSAJES_CONTACTO_VER,
    descripcion: 'Permite ver mensajes de contacto',
    modulo: 'mensajes_contacto',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.MENSAJES_CONTACTO_CREAR,
    descripcion: 'Permite crear mensajes de contacto',
    modulo: 'mensajes_contacto',
    accion: 'crear',
  },
  {
    nombre: PermisoEnum.MENSAJES_CONTACTO_EDITAR,
    descripcion: 'Permite editar mensajes de contacto',
    modulo: 'mensajes_contacto',
    accion: 'editar',
  },
  {
    nombre: PermisoEnum.MENSAJES_CONTACTO_ELIMINAR,
    descripcion: 'Permite eliminar mensajes de contacto',
    modulo: 'mensajes_contacto',
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

  // ==========================
  // Admin - Logs y Auditoría
  // ==========================
  {
    nombre: PermisoEnum.LOGS_VER,
    descripcion: 'Permite ver logs del sistema',
    modulo: 'logs',
    accion: 'ver',
  },
  {
    nombre: PermisoEnum.LOGS_EXPORTAR,
    descripcion: 'Permite exportar logs del sistema',
    modulo: 'logs',
    accion: 'exportar',
  },
];
