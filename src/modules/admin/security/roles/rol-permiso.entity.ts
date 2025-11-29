import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';
import { Permiso } from '../permisos/permisos.entity';

export class RolPermiso {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  rolId: number;

  @ApiProperty({ type: Number })
  permisoId: number;

  @ApiProperty({ type: () => Role })
  rol: Role;

  @ApiProperty({ type: () => Permiso })
  permiso: Permiso;
}
