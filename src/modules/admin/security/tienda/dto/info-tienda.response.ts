import { ApiProperty, OmitType } from '@nestjs/swagger';
import { InformacionTienda } from '../info-tienda.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class InformacionTiendaData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: InformacionTienda })
  data: InformacionTienda;
}

export class ResponseInformacionTiendaType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: InformacionTiendaData })
  declare response: InformacionTiendaData;
}
