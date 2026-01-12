/**
 * Enum para métodos de pago
 * Valores almacenados como Int en la base de datos
 */
export enum MetodoPagoEnum {
  EFECTIVO = 1,
  QR = 2,
  TRANSFERENCIA = 3,
  CHEQUE = 4,
  DEPOSITO = 5,
}

export const MetodoPagoLabel: Record<MetodoPagoEnum, string> = {
  [MetodoPagoEnum.EFECTIVO]: 'Efectivo',
  [MetodoPagoEnum.QR]: 'QR',
  [MetodoPagoEnum.TRANSFERENCIA]: 'Transferencia',
  [MetodoPagoEnum.CHEQUE]: 'Cheque',
  [MetodoPagoEnum.DEPOSITO]: 'Depósito',
};
