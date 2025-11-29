import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Categoria, CategoriaDetail } from '../categoria.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class CategoriaData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Categoria })
  data: Categoria;
}

export class ResponseCategoriaType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriaData })
  declare response: CategoriaData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class CategoriaDetailData {
  @ApiProperty({ type: CategoriaDetail })
  data: CategoriaDetail;
}

export class ResponseCategoriaDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriaDetailData })
  declare response: CategoriaDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class CategoriasData {
  @ApiProperty({ type: [Categoria] })
  data?: Categoria[];
}

export class ResponseCategoriasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CategoriasData })
  declare response: CategoriasData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateCategoriasData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Categoria] })
  data?: Categoria[];
}

export class PaginateCategoriasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateCategoriasData })
  declare response: PaginateCategoriasData;
}
