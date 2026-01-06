import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { DerivacionDetail, DerivacionEntity } from '../derivacion.entity';

// Respuesta individual
class DerivacionData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: DerivacionEntity })
  data: DerivacionEntity;
}

export class ResponseDerivacionType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DerivacionData })
  declare response: DerivacionData;
}

// Respuesta detallada
export class ResponseDerivacionDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DerivacionDetail })
  declare response: DerivacionDetail;
}

// Respuesta lista simple
class DerivacionesData {
  @ApiProperty({ type: [DerivacionEntity] })
  data?: DerivacionEntity[];
}

export class ResponseDerivacionesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DerivacionesData })
  declare response: DerivacionesData;
}

// Respuesta lista paginada
class PaginateDerivacionesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [DerivacionEntity] })
  data?: DerivacionEntity[];
}

export class PaginateDerivacionesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateDerivacionesData })
  declare response: PaginateDerivacionesData;
}

/* ---------------------------------- // Respuesta de estadísticas de derivaciones ---------------------------------- */
/**
 * DTO para estadísticas de derivaciones
 */
export class DerivacionesStatsDto {
  @ApiProperty({ type: Number, description: 'Derivaciones pendientes de visualizar' })
  recibidas: number;

  @ApiProperty({ type: Number, description: 'Derivaciones enviadas activas' })
  enviadas: number;

  @ApiProperty({ type: Number, description: 'Derivaciones rechazadas' })
  pendientesPago: number;

  @ApiProperty({ type: Number, description: 'Derivaciones rechazadas' })
  finalizados: number;

  @ApiProperty({ type: Number, description: 'Total de derivaciones' })
  total: number;
}

class DerivacionesStatsData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: DerivacionesStatsDto })
  data: DerivacionesStatsDto;
}

export class ResponseDerivacionesStatsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DerivacionesStatsData })
  declare response: DerivacionesStatsData;
}
