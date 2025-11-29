import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RolPermiso } from '../roles/rol-permiso.entity';

export class Permiso {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @ApiProperty({ type: String })
  modulo: string;

  @ApiProperty({ type: String })
  accion: string;

  @ApiProperty({ type: Boolean })
  estaActivo: boolean = true;

  @ApiProperty({ isArray: true, type: () => RolPermiso })
  rolPermisos: RolPermiso[];
}
