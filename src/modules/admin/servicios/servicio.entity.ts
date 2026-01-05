import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';
import { Cliente } from '../clientes/cliente.entity';
import { TipoDocumento } from '../catalogos/tipos-documento/tipo-documento.entity';
import { TipoTramite } from '../catalogos/tipos-tramite/tipo-tramite.entity';
import { EstadoTramite } from '../catalogos/estados-tramite/estado-tramite.entity';
import { HistorialEstadosServicio } from './historial-estados-servicio/historial-estados-servicio.entity';
import { ResponsableServicio } from './responsable-servicio/responsable-servicio.entity';
import { DerivacionServicio } from './derivaciones/derivacion.entity';
import { PagosIngresos } from '../finanzas/pagos-ingresos/pagos-ingresos.entity';

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
  cliente?: Cliente;

  @ApiPropertyOptional()
  tipoDocumento?: TipoDocumento;

  @ApiPropertyOptional()
  tipoTramite?: TipoTramite;

  @ApiPropertyOptional()
  estadoActual?: EstadoTramite;

  @ApiPropertyOptional()
  historialEstadosServicio?: HistorialEstadosServicio[];

  @ApiPropertyOptional()
  responsablesServicio?: ResponsableServicio[];

  @ApiPropertyOptional()
  derivaciones?: DerivacionServicio[];

  @ApiPropertyOptional()
  pagosIngresos?: PagosIngresos[];
}
