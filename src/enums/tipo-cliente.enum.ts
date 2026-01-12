/**
 * Enum para tipos de cliente
 * Valores almacenados como Int en la base de datos
 */
export enum TipoClienteEnum {
  NATURAL = 1,
  JURIDICA = 2,
}

export const TipoClienteLabel: Record<TipoClienteEnum, string> = {
  [TipoClienteEnum.NATURAL]: 'Persona Natural',
  [TipoClienteEnum.JURIDICA]: 'Persona Jurídica',
};
