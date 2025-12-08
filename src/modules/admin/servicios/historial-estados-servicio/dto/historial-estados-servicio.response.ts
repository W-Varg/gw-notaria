import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { HistorialEstadosServicio } from '../historial-estados-servicio.entity';

class HistorialEstadosServicioData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: HistorialEstadosServicio })
  data: HistorialEstadosServicio;
}

export class ResponseHistorialEstadosServicioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: HistorialEstadosServicioData })
  declare response: HistorialEstadosServicioData;
}

export class ResponseHistorialEstadosServicioDetailType extends OmitType(ApiOkResponseDto, [
  'cache',
]) {
  @ApiProperty({ type: HistorialEstadosServicioData })
  declare response: HistorialEstadosServicioData;
}

class HistorialEstadosServiciosData {
  @ApiProperty({ type: [HistorialEstadosServicio] })
  data?: HistorialEstadosServicio[];
}

export class ResponseHistorialEstadosServiciosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: HistorialEstadosServiciosData })
  declare response: HistorialEstadosServiciosData;
}

class PaginateHistorialEstadosServiciosData extends OmitType(ResponseStructDTO, [
  'validationErrors',
]) {
  @ApiProperty({ type: [HistorialEstadosServicio] })
  data?: HistorialEstadosServicio[];
}

export class PaginateHistorialEstadosServiciosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateHistorialEstadosServiciosData })
  declare response: PaginateHistorialEstadosServiciosData;
}
