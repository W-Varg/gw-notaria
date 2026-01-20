import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '../../../../generated/prisma/client';

export class ArqueosDiarios {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fecha: Date;

  @ApiPropertyOptional()
  usuarioCierreId?: string;

  @ApiProperty()
  totalIngresosEfectivo: Prisma.Decimal;

  @ApiProperty()
  totalIngresosBancos: Prisma.Decimal;

  @ApiProperty()
  totalEgresosEfectivo: Prisma.Decimal;

  @ApiProperty()
  totalEgresosBancos: Prisma.Decimal;

  @ApiProperty()
  saldoFinalDia: Prisma.Decimal;

  @ApiPropertyOptional()
  observaciones?: string;

  @ApiProperty()
  fechaCierre: Date;
}
