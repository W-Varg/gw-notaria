import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { EstadoTramite } from '../estado-tramite.entity';

class EstadoTramiteData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: EstadoTramite })
  data: EstadoTramite;
}

export class ResponseEstadoTramiteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: EstadoTramiteData })
  declare response: EstadoTramiteData;
}

export class ResponseEstadoTramiteDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: EstadoTramiteData })
  declare response: EstadoTramiteData;
}

class EstadosTramiteData {
  @ApiProperty({ type: [EstadoTramite] })
  data?: EstadoTramite[];
}

export class ResponseEstadosTramiteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: EstadosTramiteData })
  declare response: EstadosTramiteData;
}

class PaginateEstadosTramiteData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [EstadoTramite] })
  data?: EstadoTramite[];
}

export class PaginateEstadosTramiteType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateEstadosTramiteData })
  declare response: PaginateEstadosTramiteData;
}
