import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UsuarioRol } from './usuario-rol.entity';

export class Usuario {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: String })
  apellidos: string;

  @ApiPropertyOptional({ type: String })
  telefono?: string;

  @ApiPropertyOptional({ type: String })
  direccion?: string;

  @ApiPropertyOptional({ type: String })
  avatar?: string;

  @ApiProperty({ type: Boolean })
  estaActivo: boolean = true;

  @ApiProperty({ type: Boolean })
  emailVerificado: boolean = false;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;

  // @ApiProperty({ isArray: true, type: () => UsuarioRol })
  // usuarioRoles: UsuarioRol[];
}

export class UsuarioDetail extends Usuario {
  @ApiProperty({ isArray: true, type: () => UsuarioRol })
  roles: UsuarioRol[];
}
