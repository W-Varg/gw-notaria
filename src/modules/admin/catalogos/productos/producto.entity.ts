import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnidadMedida } from 'src/enums';

export class Producto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @ApiProperty({ type: Number })
  precio: number;

  @ApiProperty({ type: Number })
  peso: number;

  @ApiProperty({ enum: UnidadMedida })
  unidad: UnidadMedida;

  @ApiProperty({ type: Number })
  stock: number;

  @ApiProperty({ type: String })
  codigoSKU: string;

  @ApiProperty({ type: Boolean })
  estaActivo: boolean = true;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;

  @ApiProperty({ type: String })
  tipoProductoId: string;

  @ApiProperty({ type: String })
  categoriaId: string;
}
