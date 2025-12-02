import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos/response.dto';
import { Categoria } from 'src/modules/admin/catalogos/categorias/categoria.entity';
import { ResponseTipoProductoType } from 'src/modules/admin/catalogos/tipos-producto/dto/tipos-producto.response';

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   categoria types                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */
export class CategoriaPublica extends OmitType(Categoria, [
  'estaActiva',
  'fechaCreacion',
  'fechaActualizacion',
]) {}

class CategoriaDataPublic {
  @ApiProperty({ type: [CategoriaPublica] })
  data: CategoriaPublica[];
}

export class CategoriasTypePublic extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriaDataPublic })
  response: CategoriaDataPublic;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 tipo producto types                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export class TiposProductosTypePublic extends ResponseTipoProductoType {}
