import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnidadMedida } from 'src/enums';
import { Categoria } from '../../catalogos/categorias/categoria.entity';
import { TipoProducto } from '../../catalogos/tipos-producto/tipo-producto.entity';

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

  @ApiProperty({ enum: UnidadMedida, enumName: 'UnidadMedida' })
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

  @ApiProperty({ type: () => Categoria })
  categoria: Categoria;

  @ApiProperty({ type: () => TipoProducto })
  tipo: TipoProducto;

  // @ApiProperty({ isArray: true, type: () => ImagenProducto })
  // imagenes: ImagenProducto[];

  // @ApiProperty({ isArray: true, type: () => Inventario })
  // inventarios: Inventario[];

  // @ApiProperty({ isArray: true, type: () => ProductoVariante })
  // variantes: ProductoVariante[];

  //   @ApiProperty({ isArray: true, type: () => Resenia })
  //   resenas: Resenia[];

  //   @ApiProperty({ isArray: true, type: () => ItemCarrito })
  //   itemsCarrito: ItemCarrito[];

  //   @ApiProperty({ isArray: true, type: () => ItemPedido })
  //   itemsPedido: ItemPedido[];

  //   @ApiProperty({ isArray: true, type: () => ItemReserva })
  //   ItemReserva: ItemReserva[];

  //   @ApiProperty({ isArray: true, type: () => InventarioMovimiento })
  //   InventarioMovimiento: InventarioMovimiento[];
}
