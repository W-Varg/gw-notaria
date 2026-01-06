import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../security/usuarios/usuario.entity';
import { Servicio } from '../servicio.entity';

export class DerivacionEntity {
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
  servicio?: Servicio;

  @ApiPropertyOptional()
  usuarioOrigen?: Usuario;

  @ApiPropertyOptional()
  usuarioDestino?: Usuario;
}
