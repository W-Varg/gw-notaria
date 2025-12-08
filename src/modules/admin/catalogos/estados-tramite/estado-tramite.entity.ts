import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EstadoTramite {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombre: string;

  @ApiPropertyOptional()
  descripcion?: string;

  @ApiPropertyOptional()
  colorHex?: string;

  @ApiProperty()
  orden: number;

  @ApiProperty()
  estaActivo: boolean;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}
