import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../common/dtos/response.dto';
import { ServicioEntity } from '../servicio.entity';
import { ServiciosStatsDto } from './servicio.input-extended.dto';

class ServicioData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: ServicioEntity })
  data: ServicioEntity;
}

export class ResponseServicioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ServicioData })
  declare response: ServicioData;
}

export class ResponseServicioDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ServicioData })
  declare response: ServicioData;
}

class ServiciosData {
  @ApiProperty({ type: [ServicioEntity] })
  data?: ServicioEntity[];
}

export class ResponseServiciosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ServiciosData })
  declare response: ServiciosData;
}

class PaginateServiciosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [ServicioEntity] })
  data?: ServicioEntity[];
}

export class PaginateServiciosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateServiciosData })
  declare response: PaginateServiciosData;
}

// Respuesta de estadísticas del dashboard
class ServiciosStatsData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: ServiciosStatsDto })
  data: ServiciosStatsDto;
}

export class ResponseServiciosStatsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ServiciosStatsData })
  declare response: ServiciosStatsData;
}
