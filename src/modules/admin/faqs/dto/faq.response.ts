import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../common/dtos/response.dto';
import { Faq } from '../faq.entity';

// ==================== RESPUESTA INDIVIDUAL ====================
class FaqData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Faq })
  data: Faq;
}

export class ResponseFaqType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: FaqData })
  declare response: FaqData;
}

// ==================== RESPUESTA LISTA SIMPLE ====================
class FaqsData {
  @ApiProperty({ type: [Faq] })
  data?: Faq[];
}

export class ResponseFaqsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: FaqsData })
  declare response: FaqsData;
}

// ==================== RESPUESTA LISTA PAGINADA ====================
class PaginateFaqsData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Faq] })
  data?: Faq[];
}

export class PaginateFaqsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateFaqsData })
  declare response: PaginateFaqsData;
}
