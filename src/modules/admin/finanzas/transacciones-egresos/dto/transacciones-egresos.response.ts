import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../../common/dtos/response.dto';
import { TransaccionesEgresos } from '../transacciones-egresos.entity';

class TransaccionesEgresosData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: TransaccionesEgresos })
  data: TransaccionesEgresos;
}

export class ResponseTransaccionesEgresosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TransaccionesEgresosData })
  declare response: TransaccionesEgresosData;
}

export class ResponseTransaccionesEgresosDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TransaccionesEgresosData })
  declare response: TransaccionesEgresosData;
}

class ListTransaccionesEgresosData {
  @ApiProperty({ type: [TransaccionesEgresos] })
  data?: TransaccionesEgresos[];
}

export class ResponseListTransaccionesEgresosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ListTransaccionesEgresosData })
  declare response: ListTransaccionesEgresosData;
}

class PaginateTransaccionesEgresosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [TransaccionesEgresos] })
  data?: TransaccionesEgresos[];
}

export class PaginateTransaccionesEgresosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateTransaccionesEgresosData })
  declare response: PaginateTransaccionesEgresosData;
}
