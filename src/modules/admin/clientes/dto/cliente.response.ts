import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../common/dtos/response.dto';
import { ClienteEntity } from '../cliente.entity';

class ClienteData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: ClienteEntity })
  data: ClienteEntity;
}

export class ResponseClienteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ClienteData })
  declare response: ClienteData;
}

export class ResponseClienteDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ClienteData })
  declare response: ClienteData;
}

class ClientesData {
  @ApiProperty({ type: [ClienteEntity] })
  data?: ClienteEntity[];
}

export class ResponseClientesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ClientesData })
  declare response: ClientesData;
}

class PaginateClientesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [ClienteEntity] })
  data?: ClienteEntity[];
}

export class PaginateClientesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateClientesData })
  declare response: PaginateClientesData;
}
