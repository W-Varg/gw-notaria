import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MensajeContacto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  usuarioId?: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  correo: string;

  @ApiPropertyOptional()
  telefono?: string;

  @ApiProperty()
  asunto: string;

  @ApiProperty()
  mensaje: string;

  @ApiProperty()
  categoria: string;

  @ApiProperty()
  estado: string;

  @ApiPropertyOptional()
  userCreateId?: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}
