import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  ApiOkResponseDto,
  ResponseDTO,
  ResponseStructDTO,
} from '../../../../../common/dtos/response.dto';
import { TipoTramiteEntity, TipoTramiteDetail } from '../tipo-tramite.entity';
class TipoTramiteData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: TipoTramiteEntity })
  data: TipoTramiteEntity;
}

export class ResponseTipoTramiteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TipoTramiteData })
  declare response: TipoTramiteData;
}
/* ------------------------------------------------------------------------------------------------------------------ */

class TipoTramiteDetailData {
  @ApiProperty({ type: TipoTramiteDetail })
  data: TipoTramiteDetail;
}

export class ResponseTipoTramiteDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TipoTramiteDetailData })
  declare response: TipoTramiteDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class TiposTramiteData {
  @ApiProperty({ type: [TipoTramiteEntity] })
  data?: TipoTramiteEntity[];
}

export class ResponseTiposTramiteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TiposTramiteData })
  declare response: TiposTramiteData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateTiposTramiteData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [TipoTramiteEntity] })
  data?: TipoTramiteEntity[];
}

export class PaginateTiposTramiteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateTiposTramiteData })
  declare response: PaginateTiposTramiteData;
}
