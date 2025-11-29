import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SucursalEntity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: String })
  direccion: string;

  @ApiProperty({ type: String })
  ciudad: string;

  @ApiPropertyOptional({ type: String })
  telefono?: string;

  @ApiPropertyOptional({ type: Number })
  latitud?: number;

  @ApiPropertyOptional({ type: Number })
  longitud?: number;

  @ApiProperty({ type: Boolean })
  estaActiva: boolean;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}
