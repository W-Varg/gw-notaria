import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';
import { MetodoPagoEnum } from 'src/enums/metodo-pago.enum';
import { ConstanciaEnum } from 'src/generated/prisma/enums';

export class PagosIngresos {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  servicioId?: string;

  @ApiProperty()
  fecha: Date;

  @ApiProperty()
  monto: Prisma.Decimal;

  @ApiProperty({
    type: Number,
    enum: MetodoPagoEnum,
    description: '1 = EFECTIVO, 2 = QR, 3 = TRANSFERENCIA, 4 = CHEQUE, 5 = DEPOSITO',
  })
  tipoPago: MetodoPagoEnum;

  @ApiPropertyOptional()
  cuentaBancariaId?: number;

  @ApiPropertyOptional({ enum: ConstanciaEnum })
  constanciaTipo?: ConstanciaEnum;

  @ApiPropertyOptional()
  numeroConstancia?: string;

  @ApiPropertyOptional()
  concepto?: string;

  @ApiPropertyOptional()
  usuarioRegistroId?: string;
}
