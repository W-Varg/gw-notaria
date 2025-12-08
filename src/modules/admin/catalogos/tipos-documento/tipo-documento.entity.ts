import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';

export class TipoDocumento {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombre: string;

  @ApiPropertyOptional()
  descripcion?: string;

  @ApiProperty()
  precioBase: Prisma.Decimal;

  @ApiProperty()
  estaActivo: boolean;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}
