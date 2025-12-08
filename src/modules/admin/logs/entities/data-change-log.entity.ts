import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DataChangeLog {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tabla: string;

  @ApiProperty()
  registroId: string;

  @ApiProperty()
  campo: string;

  @ApiPropertyOptional()
  valorAnterior?: string;

  @ApiPropertyOptional()
  valorNuevo?: string;

  @ApiProperty()
  tipoCambio: string;

  @ApiPropertyOptional()
  usuarioId?: string;

  @ApiPropertyOptional()
  usuarioEmail?: string;

  @ApiPropertyOptional()
  usuarioNombre?: string;

  @ApiPropertyOptional()
  razonCambio?: string;

  @ApiPropertyOptional()
  ipOrigen?: string;

  @ApiProperty()
  fechaCambio: Date;
}
