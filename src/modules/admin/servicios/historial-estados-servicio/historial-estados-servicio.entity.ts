import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HistorialEstadosServicio {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  usuarioId?: string;

  @ApiProperty()
  servicioId: string;

  @ApiProperty({ type: Number })
  estadoId: number;

  @ApiProperty()
  fechaCambio: Date;

  @ApiPropertyOptional()
  comentario?: string;
}
