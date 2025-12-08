import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { Cliente } from '../cliente.entity';

class ClienteData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Cliente })
  data: Cliente;
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
  @ApiProperty({ type: [Cliente] })
  data?: Cliente[];
}

export class ResponseClientesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ClientesData })
  declare response: ClientesData;
}

class PaginateClientesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Cliente] })
  data?: Cliente[];
}

export class PaginateClientesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateClientesData })
  declare response: PaginateClientesData;
}
