import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '../../../../generated/prisma/client';

export class Gastos {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiPropertyOptional()
  descripcion?: string;

  @ApiPropertyOptional()
  proveedor?: string;

  @ApiProperty()
  montoTotal: Prisma.Decimal;

  @ApiProperty()
  montoPagado: Prisma.Decimal;

  @ApiPropertyOptional()
  saldo?: Prisma.Decimal;

  @ApiProperty()
  fechaGasto: Date;

  @ApiPropertyOptional()
  categoria?: string;

  @ApiPropertyOptional()
  usuarioId?: string;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}
