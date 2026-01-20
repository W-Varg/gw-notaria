import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../../common/dtos/response.dto';
import { PagosIngresos } from '../pagos-ingresos.entity';

class PagosIngresosData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: PagosIngresos })
  data: PagosIngresos;
}

export class ResponsePagosIngresosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PagosIngresosData })
  declare response: PagosIngresosData;
}

export class ResponsePagosIngresosDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PagosIngresosData })
  declare response: PagosIngresosData;
}

class ListPagosIngresosData {
  @ApiProperty({ type: [PagosIngresos] })
  data?: PagosIngresos[];
}

export class ResponseListPagosIngresosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ListPagosIngresosData })
  declare response: ListPagosIngresosData;
}

class PaginatePagosIngresosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [PagosIngresos] })
  data?: PagosIngresos[];
}

export class PaginatePagosIngresosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginatePagosIngresosData })
  declare response: PaginatePagosIngresosData;
}
