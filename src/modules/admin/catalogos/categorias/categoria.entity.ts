import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Producto } from '../productos/producto.entity';

export class Categoria {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiPropertyOptional({ type: String })
  descripcion?: string;

  @ApiPropertyOptional({ type: String })
  imagen?: string;

  @ApiProperty({ type: Boolean })
  estaActiva: boolean = true;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;

  @ApiProperty({ type: Date })
  fechaActualizacion: Date;
}

export class CategoriaDetail extends Categoria {
  @ApiProperty({ isArray: true, type: () => Producto })
  productos: Producto[];
}
