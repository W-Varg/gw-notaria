import { ApiProperty } from '@nestjs/swagger';
import { TipoAccionEnum } from 'src/generated/prisma/enums';
import { Usuario } from '../../security/usuarios/usuario.entity';

export class AuditLog {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: TipoAccionEnum, nullable: false })
  accion!: `${TipoAccionEnum}`;

  @ApiProperty({ type: String, nullable: false })
  modulo!: string;

  @ApiProperty({ type: String, nullable: true })
  tabla!: string | null;

  @ApiProperty({ type: String, nullable: true })
  registroId!: string | null;

  @ApiProperty({ type: String, nullable: false })
  descripcion!: string;

  @ApiProperty({ type: String, nullable: true })
  usuarioId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  usuarioEmail!: string | null;

  @ApiProperty({ type: String, nullable: true })
  usuarioNombre!: string | null;

  @ApiProperty({ type: String, nullable: true })
  usuarioIp!: string | null;

  @ApiProperty({ type: String, nullable: true })
  userAgent!: string | null;

  @ApiProperty({ nullable: true })
  datosAnteriores?: object;

  @ApiProperty({ nullable: true })
  datosNuevos?: object;

  @ApiProperty({ nullable: true })
  cambiosRealizados?: object;

  @ApiProperty({ nullable: true })
  metadatos?: object;

  @ApiProperty({ type: Number, nullable: true })
  duracionMs!: number | null;

  @ApiProperty({ type: Boolean, default: true, nullable: false })
  exitoso!: boolean;

  @ApiProperty({ type: String, nullable: true })
  mensajeError!: string | null;

  @ApiProperty({ type: Date, nullable: false })
  fechaCreacion!: Date;

  @ApiProperty({ type: Usuario, nullable: true })
  usuario?: Usuario | null;
}
