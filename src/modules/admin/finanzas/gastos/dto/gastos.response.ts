import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { Gastos } from '../gastos.entity';

class GastosData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Gastos })
  data: Gastos;
}

export class ResponseGastosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: GastosData })
  declare response: GastosData;
}

export class ResponseGastosDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: GastosData })
  declare response: GastosData;
}

class ListGastosData {
  @ApiProperty({ type: [Gastos] })
  data?: Gastos[];
}

export class ResponseListGastosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ListGastosData })
  declare response: ListGastosData;
}

class PaginateGastosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Gastos] })
  data?: Gastos[];
}

export class PaginateGastosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateGastosData })
  declare response: PaginateGastosData;
}
