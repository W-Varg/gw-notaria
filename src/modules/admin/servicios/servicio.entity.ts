import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';
import { ClienteEntity } from '../clientes/cliente.entity';
import { TipoDocumentoEntity } from '../catalogos/tipos-documento/tipo-documento.entity';
import { TipoTramiteEntity } from '../catalogos/tipos-tramite/tipo-tramite.entity';
import { EstadoTramite } from '../catalogos/estados-tramite/estado-tramite.entity';
import { HistorialEstadosServicio } from './historial-estados-servicio/historial-estados-servicio.entity';
import { ResponsableServicio } from './responsable-servicio/responsable-servicio.entity';
import { DerivacionEntity } from './derivaciones/derivacion.entity';
import { PagosIngresos } from '../finanzas/pagos-ingresos/pagos-ingresos.entity';
import { SucursalEntity } from '../catalogos/sucursales/sucursal.entity';

export class ServicioEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codigoTicket: string;

  @ApiProperty()
  clienteId: string;

  @ApiPropertyOptional({ type: Number })
  comercializadoraId?: number;

  @ApiProperty()
  tipoDocumentoId: string;

  @ApiPropertyOptional()
  tipoTramiteId?: string;

  @ApiPropertyOptional({ type: Number })
  sucursalId?: number;

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
  cliente?: ClienteEntity;

  @ApiPropertyOptional()
  comercializadora?: any;

  @ApiPropertyOptional()
  tipoDocumento?: TipoDocumentoEntity;

  @ApiPropertyOptional()
  tipoTramite?: TipoTramiteEntity;

  @ApiPropertyOptional({ type: () => SucursalEntity })
  sucursal?: SucursalEntity;

  @ApiPropertyOptional()
  estadoActual?: EstadoTramite;

  @ApiPropertyOptional()
  historialEstadosServicio?: HistorialEstadosServicio[];

  @ApiPropertyOptional()
  responsablesServicio?: ResponsableServicio[];

  @ApiPropertyOptional()
  derivaciones?: DerivacionEntity[];

  @ApiPropertyOptional()
  pagosIngresos?: PagosIngresos[];
}
