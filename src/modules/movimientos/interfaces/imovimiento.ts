import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/client';
import { ConstanciaEnum, MetodoPagoEnum } from 'src/generated/prisma/enums';
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
  referencia: ConstanciaEnum;
  @ApiProperty({ enum: MetodoPagoEnum })
  metodoPago: MetodoPagoEnum;
  @ApiProperty({ type: Number })
  ingreso: Decimal;
  @ApiProperty({ type: Number })
  egreso: Decimal;

  @ApiProperty({ type: Banco })
  banco?: Banco;
}
