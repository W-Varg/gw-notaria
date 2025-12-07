import { ApiProperty } from '@nestjs/swagger';

// ==================== NOTIFICACION ENTITY ====================
export class Notificacion {
  @ApiProperty({ type: String, description: 'ID de la notificación' })
  id: string;

  @ApiProperty({ type: String, description: 'ID del usuario destinatario' })
  usuarioId: string;

  @ApiProperty({ type: String, description: 'Título de la notificación' })
  titulo: string;

  @ApiProperty({ type: String, description: 'Mensaje de la notificación' })
  mensaje: string;

  @ApiProperty({
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    description: 'Tipo de notificación',
  })
  tipo: string;

  @ApiProperty({ type: Boolean, description: 'Estado de lectura' })
  leida: boolean;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Icono de PrimeIcons',
  })
  icono: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Ruta de navegación',
  })
  ruta: string | null;

  @ApiProperty({ type: Date, description: 'Fecha de creación' })
  fechaCreacion: Date;

  @ApiProperty({ type: Date, description: 'Fecha de actualización' })
  fechaActualizacion: Date;
}

// ==================== NOTIFICACION DETAIL ENTITY ====================
export class NotificacionDetail extends Notificacion {
  @ApiProperty({
    type: 'object',
    description: 'Información del usuario destinatario',
    properties: {
      id: { type: 'string' },
      email: { type: 'string' },
      nombre: { type: 'string' },
    },
  })
  usuario?: {
    id: string;
    email: string;
    nombre: string;
  };
}
