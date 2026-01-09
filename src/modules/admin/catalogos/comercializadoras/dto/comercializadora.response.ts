import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { Comercializadora, ComercializadoraDetail } from '../comercializadora.entity';

// ==================== RESPUESTA INDIVIDUAL ====================

class ComercializadoraData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Comercializadora })
  data: Comercializadora;
}

export class ResponseComercializadoraType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ComercializadoraData })
  declare response: ComercializadoraData;
}

// ==================== RESPUESTA DETALLADA ====================

class ComercializadoraDetailData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: ComercializadoraDetail })
  data: ComercializadoraDetail;
}

export class ResponseComercializadoraDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ComercializadoraDetailData })
  declare response: ComercializadoraDetailData;
}

// ==================== RESPUESTA LISTA SIMPLE ====================

class ComercializadorasData {
  @ApiProperty({ type: [Comercializadora] })
  data?: Comercializadora[];
}

export class ResponseComercializadorasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ComercializadorasData })
  declare response: ComercializadorasData;
}

// ==================== RESPUESTA LISTA PAGINADA ====================

class PaginateComercializadorasData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Comercializadora] })
  data?: Comercializadora[];
}

export class PaginateComercializadorasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateComercializadorasData })
  declare response: PaginateComercializadorasData;
}
