import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  HorariosSucursal,
  PoliticaTienda,
  PromocionActiva,
  PreguntaFrecuente,
  InformacionCompletaTienda,
} from '../info.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class HorariosData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: HorariosSucursal })
  data: HorariosSucursal;
}

export class ResponseHorariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: HorariosData })
  declare response: HorariosData;
}

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

class PromocionesData {
  @ApiProperty({ type: [PromocionActiva] })
  data?: PromocionActiva[];
}

export class ResponsePromocionesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PromocionesData })
  declare response: PromocionesData;
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
