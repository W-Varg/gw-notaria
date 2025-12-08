import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlantillaDocumento {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tipoDocumentoId: string;

  @ApiProperty()
  nombrePlantilla: string;

  @ApiPropertyOptional()
  descripcion?: string;

  @ApiProperty()
  contenidoHtml: string;

  @ApiProperty()
  estaActiva: boolean;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}
