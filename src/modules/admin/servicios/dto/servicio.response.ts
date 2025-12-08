import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { Servicio } from '../servicio.entity';

class ServicioData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Servicio })
  data: Servicio;
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
  @ApiProperty({ type: [Servicio] })
  data?: Servicio[];
}

export class ResponseServiciosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ServiciosData })
  declare response: ServiciosData;
}

class PaginateServiciosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Servicio] })
  data?: Servicio[];
}

export class PaginateServiciosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateServiciosData })
  declare response: PaginateServiciosData;
}
