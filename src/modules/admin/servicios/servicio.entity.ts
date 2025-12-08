import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';

export class Servicio {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codigoTicket: string;

  @ApiProperty()
  clienteId: string;

  @ApiProperty()
  tipoDocumentoId: string;

  @ApiPropertyOptional()
  claseTramite?: string;

  @ApiPropertyOptional()
  tipoTramite?: string;

  @ApiPropertyOptional()
  negocio?: string;

  @ApiProperty()
  fechaInicio: Date;

  @ApiPropertyOptional()
  observaciones?: string;

  @ApiPropertyOptional()
  contenidoFinal?: string;

  @ApiProperty()
  montoTotal: Prisma.Decimal;

  @ApiProperty()
  saldoPendiente: Prisma.Decimal;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaActualizacion: Date;
}
