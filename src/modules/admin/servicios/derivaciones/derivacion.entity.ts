import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DerivacionServicio {
  @ApiProperty()
  id: number;

  @ApiProperty()
  servicioId: string;

  @ApiProperty()
  usuarioOrigenId: string;

  @ApiProperty()
  usuarioDestinoId: string;

  @ApiProperty()
  fechaDerivacion: Date;

  @ApiPropertyOptional()
  motivo?: string;

  @ApiProperty({ default: 'normal' })
  prioridad: string;

  @ApiPropertyOptional()
  comentario?: string;

  @ApiProperty({ default: false })
  aceptada: boolean;

  @ApiPropertyOptional()
  fechaAceptacion?: Date;

  // Relaciones
  @ApiPropertyOptional()
  servicio?: any;

  @ApiPropertyOptional()
  usuarioOrigen?: any;

  @ApiPropertyOptional()
  usuarioDestino?: any;
}
