/**
 * Enum para niveles de log
 * Valores almacenados como Int en la base de datos
 */
export enum NivelLogEnum {
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  CRITICAL = 4,
  DEBUG = 5,
}

export const NivelLogLabel: Record<NivelLogEnum, string> = {
  [NivelLogEnum.INFO]: 'Info',
  [NivelLogEnum.WARNING]: 'Warning',
  [NivelLogEnum.ERROR]: 'Error',
  [NivelLogEnum.CRITICAL]: 'Critical',
  [NivelLogEnum.DEBUG]: 'Debug',
};
