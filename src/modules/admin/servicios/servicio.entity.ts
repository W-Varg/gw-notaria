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
  tipoTramiteId?: string;

  @ApiPropertyOptional()
  estadoActualId?: string;

  @ApiProperty()
  fechaInicio: Date;

  @ApiPropertyOptional()
  fechaFinalizacion?: Date;

  @ApiPropertyOptional()
  fechaEstimadaEntrega?: Date;

  @ApiPropertyOptional()
  plazoEntregaDias?: number;

  @ApiProperty({ default: 'normal' })
  prioridad: string;

  @ApiPropertyOptional()
  observaciones?: string;

  @ApiPropertyOptional()
  contenidoFinal?: string;

  @ApiProperty()
  montoTotal: Prisma.Decimal;

  @ApiProperty()
  saldoPendiente: Prisma.Decimal;

  @ApiProperty({ default: true })
  estaActivo: boolean;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaActualizacion: Date;

  // Relaciones
  @ApiPropertyOptional()
  cliente?: any;

  @ApiPropertyOptional()
  tipoDocumento?: any;

  @ApiPropertyOptional()
  tipoTramite?: any;

  @ApiPropertyOptional()
  estadoActual?: any;

  @ApiPropertyOptional()
  historialEstadosServicio?: any[];

  @ApiPropertyOptional()
  responsablesServicio?: any[];

  @ApiPropertyOptional()
  derivaciones?: any[];

  @ApiPropertyOptional()
  pagosIngresos?: any[];
}
