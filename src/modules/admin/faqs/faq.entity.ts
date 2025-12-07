import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Faq {
  @ApiProperty({ type: String, description: 'ID único de la FAQ' })
  id: string;

  @ApiProperty({ type: String, description: 'Pregunta frecuente' })
  pregunta: string;

  @ApiProperty({ type: String, description: 'Respuesta a la pregunta' })
  respuesta: string;

  @ApiPropertyOptional({ type: String, nullable: true, description: 'Categoría de la pregunta' })
  categoria: string | null;

  @ApiProperty({ type: Number, description: 'Orden de visualización' })
  orden: number;

  @ApiProperty({ type: Boolean, description: 'Estado activo/inactivo' })
  estaActiva: boolean;

  @ApiProperty({ type: Date, description: 'Fecha de creación' })
  fechaCreacion: Date;

  @ApiProperty({ type: Date, description: 'Fecha de última actualización' })
  fechaActualizacion: Date;
}
