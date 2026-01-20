import { ApiProperty } from '@nestjs/swagger';
import { NivelLogEnum } from '../../../enums/nivel-log.enum';

export class SystemLog {
  @ApiProperty({ nullable: false })
  id!: string;

  @ApiProperty({ nullable: false, enum: NivelLogEnum })
  nivel!: NivelLogEnum;

  @ApiProperty({ nullable: false })
  mensaje: string;

  @ApiProperty({ nullable: true })
  contexto: string | null;

  @ApiProperty({ nullable: true })
  modulo: string | null;

  @ApiProperty({ nullable: true })
  stackTrace: string | null;

  @ApiProperty({ nullable: true })
  metadatos: object | null;

  @ApiProperty({ nullable: true })
  usuarioId: string | null;

  @ApiProperty({ nullable: true })
  usuarioEmail: string | null;

  @ApiProperty({ nullable: true })
  metodoHttp: string | null;

  @ApiProperty({ nullable: true })
  url: string | null;

  @ApiProperty({ nullable: true })
  requestBody: object | null;

  @ApiProperty({ nullable: true })
  responseCode!: number | null;

  @ApiProperty({ nullable: true })
  duracionMs!: number | null;

  @ApiProperty({ nullable: false })
  fechaCreacion!: Date;
}
