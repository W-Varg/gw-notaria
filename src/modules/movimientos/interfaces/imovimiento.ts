import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';
import { MetodoPagoEnum } from 'src/enums/metodo-pago.enum';
import { ConstanciaEnum } from 'src/generated/prisma/enums';
import { Banco } from 'src/modules/admin/catalogos/bancos/banco.entity';
export class IMovimiento {
  @ApiProperty()
  gastoId?: number;
  @ApiProperty()
  ingresoId?: number;
  @ApiProperty({ enum: ['GASTO', 'INGRESO'] })
  tipo: 'GASTO' | 'INGRESO';
  @ApiProperty()
  fecha: Date;
  @ApiProperty()
  concepto: string;
  @ApiProperty({ enum: ConstanciaEnum })
  referencia?: ConstanciaEnum;
  @ApiProperty({
    type: Number,
    enum: MetodoPagoEnum,
    description: '1 = EFECTIVO, 2 = QR, 3 = TRANSFERENCIA, 4 = CHEQUE, 5 = DEPOSITO',
  })
  metodoPago: MetodoPagoEnum;
  @ApiProperty({ type: Number })
  ingreso: Decimal;
  @ApiProperty({ type: Number })
  egreso: Decimal;

  @ApiProperty({ type: Banco })
  banco?: Banco;
}
