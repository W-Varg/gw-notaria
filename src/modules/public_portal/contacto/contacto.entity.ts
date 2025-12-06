import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MensajeEnviadoEntity {
  @ApiProperty({ description: 'ID único del mensaje', example: 'cly123456789' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre del remitente', example: 'Juan Pérez' })
  @Expose()
  nombre: string;

  @ApiProperty({ description: 'Email del remitente', example: 'juan@email.com' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Asunto del mensaje', example: 'Consulta sobre productos' })
  @Expose()
  asunto: string;

  @ApiProperty({ description: 'Contenido del mensaje', example: 'Necesito información sobre...' })
  @Expose()
  mensaje: string;

  @ApiProperty({ description: 'Teléfono del remitente', required: false, example: '123456789' })
  @Expose()
  telefono?: string;

  @ApiProperty({ description: 'Fecha de envío del mensaje', example: '2024-01-15T10:30:00Z' })
  @Expose()
  fechaEnvio: Date;

  @ApiProperty({ description: 'Estado del mensaje', example: 'PENDIENTE' })
  @Expose()
  estado: string;
}
