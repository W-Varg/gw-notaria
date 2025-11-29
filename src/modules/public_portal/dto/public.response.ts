import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos/response.dto';
import { Categoria } from 'src/modules/admin/catalogos/categorias/categoria.entity';
import { SucursalEntity } from 'src/modules/admin/catalogos/sucursales/sucursal.entity';
import { ResponseTipoProductoType } from 'src/modules/admin/catalogos/tipos-producto/dto/tipos-producto.response';

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   categoria types                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */
export class CategoriaPublica extends OmitType(Categoria, [
  'estaActiva',
  'fechaCreacion',
  'fechaActualizacion',
]) {}

export class CategoriaDataPublic {
  @ApiProperty({ type: [CategoriaPublica] })
  data: CategoriaPublica[];
}

export class CategoriasTypePublic extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriaDataPublic })
  response: CategoriaDataPublic;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   sucursal types                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */
export class SucursalPublica extends PickType(SucursalEntity, [
  'id',
  'nombre',
  'ciudad',
  'direccion',
  'telefono',
  'latitud',
  'longitud',
]) {}

export class SucursalDataPublic {
  @ApiProperty({ type: [SucursalPublica] })
  data: SucursalPublica[];
}

export class SucursalTypePublic extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SucursalDataPublic })
  response: SucursalDataPublic;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 tipo producto types                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export class TiposProductosTypePublic extends ResponseTipoProductoType {}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    reseñas types                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

export class UsuarioReseniaPublic {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: String })
  apellidos: string;
}

export class ReseniaPublic {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: UsuarioReseniaPublic })
  usuario: UsuarioReseniaPublic;

  @ApiProperty({ type: String })
  comentario: string;

  @ApiProperty({ type: Number })
  puntuacion: number;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;
}

export class ReseniasDataPublic {
  @ApiProperty({ type: [ReseniaPublic] })
  data: ReseniaPublic[];
}

export class TopReseniasTypePublic extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ReseniasDataPublic })
  response: ReseniasDataPublic;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 productos destacados types                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ImagenProductoPublic {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: Boolean })
  esPrincipal: boolean;
}

export class CategoriaProductoPublic {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;
}

export class ProductoDestacado {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;

  @ApiProperty({ type: String, nullable: true })
  descripcion: string;

  @ApiProperty({ type: Number })
  precio: number;

  @ApiProperty({ type: [ImagenProductoPublic] })
  imagenes: ImagenProductoPublic[];

  @ApiProperty({ type: CategoriaProductoPublic })
  categoria: CategoriaProductoPublic;

  @ApiProperty({ type: Date })
  fechaCreacion: Date;
}

export class ProductosDestacadosData {
  @ApiProperty({ type: [ProductoDestacado] })
  data: ProductoDestacado[];
}

export class ProductosDestacadosTypePublic extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ProductosDestacadosData })
  response: ProductosDestacadosData;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 producto detalle types                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

export class TipoProductoPublic {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  nombre: string;
}
