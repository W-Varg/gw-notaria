/**
 * Enum para tipos de acción en auditoría
 * Valores almacenados como Int en la base de datos
 */
export enum TipoAccionEnum {
  CREATE = 1, // Crear
  UPDATE = 2, // Actualizar
  DELETE = 3, // Eliminar
  READ = 4, // Leer/Visualizar
  LOGIN = 5, // Inicio de sesión
  LOGOUT = 6, // Cierre de sesión
  EXPORT = 7, // Exportar datos
  IMPORT = 8, // Importar datos
  PRINT = 9, // Imprimir
  DOWNLOAD = 10, // Descargar
  APPROVE = 11, // Aprobar
  REJECT = 12, // Rechazar
  ACTIVATE = 13, // Activar
  DEACTIVATE = 14, // Desactivar
  RESTORE = 15, // Restaurar
  CUSTOM = 16, // Acción personalizada
  PASSWORD_CHANGE = 17, // Cambio de contraseña
}

export const TipoAccionLabel: Record<TipoAccionEnum, string> = {
  [TipoAccionEnum.CREATE]: 'Crear',
  [TipoAccionEnum.UPDATE]: 'Actualizar',
  [TipoAccionEnum.DELETE]: 'Eliminar',
  [TipoAccionEnum.READ]: 'Leer',
  [TipoAccionEnum.LOGIN]: 'Inicio de sesión',
  [TipoAccionEnum.LOGOUT]: 'Cierre de sesión',
  [TipoAccionEnum.EXPORT]: 'Exportar',
  [TipoAccionEnum.IMPORT]: 'Importar',
  [TipoAccionEnum.PRINT]: 'Imprimir',
  [TipoAccionEnum.DOWNLOAD]: 'Descargar',
  [TipoAccionEnum.APPROVE]: 'Aprobar',
  [TipoAccionEnum.REJECT]: 'Rechazar',
  [TipoAccionEnum.ACTIVATE]: 'Activar',
  [TipoAccionEnum.DEACTIVATE]: 'Desactivar',
  [TipoAccionEnum.RESTORE]: 'Restaurar',
  [TipoAccionEnum.CUSTOM]: 'Acción personalizada',
  [TipoAccionEnum.PASSWORD_CHANGE]: 'Cambio de contraseña',
};
