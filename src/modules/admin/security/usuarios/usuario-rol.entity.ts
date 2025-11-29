import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from './usuario.entity';
import { Role } from '../roles/role.entity';

export class UsuarioRol {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  usuarioId: string;

  @ApiProperty({ type: Number })
  rolId: number;

  @ApiProperty({ type: () => Usuario })
  usuario: Usuario;

  @ApiProperty({ type: () => Role })
  rol: Role;
}
