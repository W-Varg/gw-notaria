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

export class InformacionContactoEntity {
  @ApiProperty({ description: 'Teléfonos de contacto', example: ['+1234567890', '+0987654321'] })
  @Expose()
  telefonos: string[];

  @ApiProperty({ description: 'Email de contacto principal', example: 'contacto@petstore.com' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Dirección física principal', example: 'Av. Principal 123, Ciudad' })
  @Expose()
  direccion: string;

  @ApiProperty({
    description: 'Horarios de atención',
    example: { lunes_viernes: '9:00-18:00', sabado: '9:00-15:00' },
  })
  @Expose()
  horarios: Record<string, string>;

  @ApiProperty({
    description: 'Enlaces a redes sociales',
    example: { facebook: '@petstore', instagram: '@petstore_oficial' },
  })
  @Expose()
  redesSociales: Record<string, string>;

  @ApiProperty({
    description: 'Información adicional',
    example: 'Contamos con servicio de entrega a domicilio',
  })
  @Expose()
  informacionAdicional?: string;
}
