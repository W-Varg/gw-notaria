import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { ResponsableServicio } from '../responsable-servicio.entity';

class ResponsableServicioData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: ResponsableServicio })
  data: ResponsableServicio;
}

export class ResponseResponsableServicioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ResponsableServicioData })
  declare response: ResponsableServicioData;
}

export class ResponseResponsableServicioDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ResponsableServicioData })
  declare response: ResponsableServicioData;
}

class ResponsablesServicioData {
  @ApiProperty({ type: [ResponsableServicio] })
  data?: ResponsableServicio[];
}

export class ResponseResponsablesServicioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ResponsablesServicioData })
  declare response: ResponsablesServicioData;
}

class PaginateResponsablesServicioData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [ResponsableServicio] })
  data?: ResponsableServicio[];
}

export class PaginateResponsablesServicioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateResponsablesServicioData })
  declare response: PaginateResponsablesServicioData;
}
