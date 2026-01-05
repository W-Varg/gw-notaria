import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TipoTramite {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  tipoDocumentoId: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @ApiPropertyOptional({ type: String })
  claseTramite?: string;

  @ApiPropertyOptional({ type: String })
  negocio?: string;

  @ApiPropertyOptional({ type: String })
  imagen?: string;

  @ApiProperty({ type: Boolean })
  estaActiva: boolean = true;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}

export class TipoTramiteDetail extends TipoTramite {
  @ApiPropertyOptional()
  tipoDocumento?: any;
}
