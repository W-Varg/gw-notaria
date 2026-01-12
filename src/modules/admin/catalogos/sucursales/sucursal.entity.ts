import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SucursalEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  abreviacion: string;

  @ApiProperty()
  departamento: string;

  @ApiProperty()
  direccion: string;

  @ApiPropertyOptional()
  telefono?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  usuarioResponsableId?: string;

  @ApiProperty()
  estaActiva: boolean;

  @ApiProperty()
  userCreateId: string;

  @ApiPropertyOptional()
  userUpdateId?: string;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;
}
