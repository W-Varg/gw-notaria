import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TipoProducto, TipoProductoDetail } from '../tipo-producto.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

export class TipoProductoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: TipoProducto })
  data: TipoProducto;
}

export class ResponseTipoProductoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TipoProductoData })
  declare response: TipoProductoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class TipoProductoDetailData {
  @ApiProperty({ type: TipoProductoDetail })
  data: TipoProductoDetail;
}

export class ResponseTipoProductoDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TipoProductoDetailData })
  declare response: TipoProductoDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class TiposProductoData {
  @ApiProperty({ type: [TipoProducto] })
  data?: TipoProducto[];
}

export class ResponseTiposProductoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TiposProductoData })
  declare response: TiposProductoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateTiposProductoData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [TipoProducto] })
  data?: TipoProducto[];
}

export class PaginateTiposProductoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateTiposProductoData })
  declare response: PaginateTiposProductoData;
}
