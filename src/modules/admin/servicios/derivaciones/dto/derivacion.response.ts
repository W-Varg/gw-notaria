import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { DerivacionServicio } from '../derivacion.entity';

// Respuesta individual
class DerivacionData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: DerivacionServicio })
  data: DerivacionServicio;
}

export class ResponseDerivacionType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DerivacionData })
  declare response: DerivacionData;
}

// Respuesta detallada
export class ResponseDerivacionDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DerivacionData })
  declare response: DerivacionData;
}

// Respuesta lista simple
class DerivacionesData {
  @ApiProperty({ type: [DerivacionServicio] })
  data?: DerivacionServicio[];
}

export class ResponseDerivacionesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DerivacionesData })
  declare response: DerivacionesData;
}

// Respuesta lista paginada
class PaginateDerivacionesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [DerivacionServicio] })
  data?: DerivacionServicio[];
}

export class PaginateDerivacionesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateDerivacionesData })
  declare response: PaginateDerivacionesData;
}
