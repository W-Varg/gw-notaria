import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';
import { MetodoPagoEnum } from 'src/generated/prisma/enums';

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

  @ApiProperty({ enum: MetodoPagoEnum })
  metodoPago: MetodoPagoEnum;
}
