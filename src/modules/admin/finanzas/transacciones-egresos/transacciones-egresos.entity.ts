import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '../../../../generated/prisma/client';
import { MetodoPagoEnum } from '../../../../enums/metodo-pago.enum';

export class TransaccionesEgresos {
  @ApiProperty()
  id: number;

  @ApiProperty()
  gastoId: number;

  @ApiProperty()
  monto: Prisma.Decimal;

  @ApiProperty()
  fecha: Date;

  @ApiPropertyOptional()
  cuentaBancariaId?: number;

  @ApiProperty({
    type: Number,
    enum: MetodoPagoEnum,
    description: '1 = EFECTIVO, 2 = QR, 3 = TRANSFERENCIA, 4 = CHEQUE, 5 = DEPOSITO',
  })
  metodoPago: MetodoPagoEnum;
}
