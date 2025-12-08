import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponsableServicio {
  @ApiProperty()
  id: number;

  @ApiProperty()
  usuarioId: string;

  @ApiProperty()
  servicioId: number;

  @ApiProperty()
  fechaAsignacion: Date;

  @ApiPropertyOptional()
  fechaBaja?: Date;

  @ApiProperty()
  activo: boolean;
}
