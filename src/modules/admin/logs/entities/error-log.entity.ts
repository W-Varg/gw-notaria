import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'src/generated/prisma/client';

export class ErrorLog {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mensaje: string;

  @ApiProperty()
  tipo: string;

  @ApiPropertyOptional()
  codigo?: string;

  @ApiProperty()
  severidad: string;

  @ApiProperty()
  stackTrace: string;

  @ApiPropertyOptional()
  contexto?: string;

  @ApiPropertyOptional()
  modulo?: string;

  @ApiPropertyOptional()
  metodoHttp?: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional()
  requestBody?: Prisma.JsonValue;

  @ApiPropertyOptional()
  usuarioId?: string;

  @ApiPropertyOptional()
  usuarioEmail?: string;

  @ApiPropertyOptional()
  ip?: string;

  @ApiProperty()
  resuelto: boolean;

  @ApiPropertyOptional()
  fechaResolucion?: Date;

  @ApiPropertyOptional()
  notasResolucion?: string;

  @ApiProperty()
  fechaError: Date;
}
