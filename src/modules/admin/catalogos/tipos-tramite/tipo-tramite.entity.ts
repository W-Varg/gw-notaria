import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '../../../../generated/prisma/client';
import { TipoDocumentoEntity } from '../tipos-documento/tipo-documento.entity';
import { SucursalEntity } from '../sucursales/sucursal.entity';

export class TipoTramiteEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Number })
  sucursalId: number;

  @ApiPropertyOptional({ type: String })
  tipoDocumentoId?: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: String })
  colorHex: string;

  @ApiProperty({ type: String })
  icon: string;

  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @ApiPropertyOptional({ type: String })
  claseTramite?: string;

  @ApiPropertyOptional({ type: String })
  negocio?: string;

  @ApiPropertyOptional({ type: String })
  imagen?: string;

  @ApiProperty({ type: Number })
  costoBase: Prisma.Decimal;

  @ApiProperty({ type: Boolean })
  estaActiva: boolean = true;

  @ApiProperty({ type: String })
  userCreateId: string;

  @ApiPropertyOptional({ type: String })
  userUpdateId?: string;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}

export class TipoTramiteDetail extends TipoTramiteEntity {
  @ApiPropertyOptional()
  tipoDocumento?: TipoDocumentoEntity;

  @ApiPropertyOptional({ type: () => SucursalEntity })
  sucursal?: SucursalEntity;
}
