import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MensajeEnviadoEntity } from '../contacto.entity';
import { ApiOkResponseDto } from 'src/common/dtos/response.dto';

class ResponseMensajeDataType {
  @ApiProperty({ type: () => MensajeEnviadoEntity })
  @Type(() => MensajeEnviadoEntity)
  @Expose()
  data: MensajeEnviadoEntity;
}

export class ResponseMensajeType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: () => ResponseMensajeDataType })
  @Type(() => ResponseMensajeDataType)
  @Expose()
  response: ResponseMensajeDataType;
}
