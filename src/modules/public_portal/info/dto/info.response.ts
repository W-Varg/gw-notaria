import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PoliticaTienda, PreguntaFrecuente, InformacionCompletaTienda } from '../info.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

/* ------------------------------------------------------------------------------------------------------------------ */

class PoliticasData {
  @ApiProperty({ type: [PoliticaTienda] })
  data?: PoliticaTienda[];
}

export class ResponsePoliticasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PoliticasData })
  declare response: PoliticasData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class FAQsData {
  @ApiProperty({ type: [PreguntaFrecuente] })
  data?: PreguntaFrecuente[];
}

export class ResponseFAQsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: FAQsData })
  declare response: FAQsData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------------------------------ */

class InformacionCompletaData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: InformacionCompletaTienda })
  data: InformacionCompletaTienda;
}

export class ResponseInformacionCompletaType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: InformacionCompletaData })
  declare response: InformacionCompletaData;
}
