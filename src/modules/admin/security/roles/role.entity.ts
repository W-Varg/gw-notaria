import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RolPermiso } from './rol-permiso.entity';

export class Role {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @ApiProperty({ type: Boolean })
  estaActivo: boolean = true;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;

  //   @ApiProperty({ isArray: true, type: () => UsuarioRol })
  //   usuarioRoles: UsuarioRol[];
}

export class RoleDetail extends Role {
  @ApiProperty({ isArray: true, type: () => RolPermiso })
  rolPermisos: RolPermiso[];
}
