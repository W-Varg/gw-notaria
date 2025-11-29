import { ApiProperty } from '@nestjs/swagger';

export class TipoProducto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}

export class TipoProductoDetail extends TipoProducto {
  // Aquí se pueden agregar relaciones si es necesario
}
