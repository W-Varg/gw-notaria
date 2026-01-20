import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '../../../../generated/prisma/client';

export class AccessLog {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  usuarioId?: string;

  @ApiPropertyOptional()
  usuarioEmail?: string;

  @ApiProperty()
  recurso: string;

  @ApiProperty()
  metodoHttp: string;

  @ApiProperty()
  url: string;

  @ApiPropertyOptional()
  endpoint?: string;

  @ApiPropertyOptional()
  requestBody?: Prisma.JsonValue;

  @ApiPropertyOptional()
  queryParams?: Prisma.JsonValue;

  @ApiProperty()
  responseCode: number;

  @ApiPropertyOptional()
  responseBody?: Prisma.JsonValue;

  @ApiProperty()
  duracionMs: number;

  @ApiProperty()
  ip: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiProperty()
  fechaAcceso: Date;
}
