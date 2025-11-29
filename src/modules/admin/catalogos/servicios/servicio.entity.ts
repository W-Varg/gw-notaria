import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Servicio {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: String })
  descripcion: string;

  @ApiProperty({ type: String })
  categoria: string;

  @ApiPropertyOptional({ type: Number })
  precio?: number;

  @ApiPropertyOptional({ type: String })
  duracion?: string;

  @ApiProperty({ type: Boolean })
  estaActivo: boolean = true;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}

export class ServicioDetail extends Servicio {
  // Aquí se pueden agregar relaciones si es necesario
}
