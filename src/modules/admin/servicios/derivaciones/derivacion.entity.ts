import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../security/usuarios/usuario.entity';
import { ServicioEntity } from '../servicio.entity';

export class DerivacionEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  servicioId: string;

  @ApiPropertyOptional()
  usuarioOrigenId?: string;

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

  @ApiProperty({ default: true })
  estaActiva: boolean;

  @ApiProperty({ default: false })
  visualizada: boolean;

  @ApiPropertyOptional()
  fechaVisualizacion?: Date;

  @ApiPropertyOptional()
  motivoCancelacion?: string;

  @ApiPropertyOptional()
  fechaCancelacion?: Date;

  @ApiPropertyOptional()
  usuarioCancelacionId?: string;
}

export class DerivacionDetail extends DerivacionEntity {
  // Relaciones
  @ApiPropertyOptional()
  servicio?: ServicioEntity;

  @ApiPropertyOptional()
  usuarioOrigen?: Usuario;

  @ApiPropertyOptional()
  usuarioDestino?: Usuario;
}
