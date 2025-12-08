import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { MensajeContacto } from '../mensaje-contacto.entity';

class MensajeContactoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: MensajeContacto })
  data: MensajeContacto;
}

export class ResponseMensajeContactoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MensajeContactoData })
  declare response: MensajeContactoData;
}

export class ResponseMensajeContactoDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MensajeContactoData })
  declare response: MensajeContactoData;
}

class MensajesContactoData {
  @ApiProperty({ type: [MensajeContacto] })
  data?: MensajeContacto[];
}

export class ResponseMensajesContactoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MensajesContactoData })
  declare response: MensajesContactoData;
}

class PaginateMensajesContactoData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [MensajeContacto] })
  data?: MensajeContacto[];
}

export class PaginateMensajesContactoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateMensajesContactoData })
  declare response: PaginateMensajesContactoData;
}
