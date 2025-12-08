import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';
import { MetodoPagoEnum, ConstanciaEnum } from 'src/generated/prisma/enums';

export class PagosIngresos {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  servicioId?: string;

  @ApiProperty()
  fecha: Date;

  @ApiProperty()
  monto: Prisma.Decimal;

  @ApiProperty({ enum: MetodoPagoEnum })
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
