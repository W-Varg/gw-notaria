import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Horario, HorarioDetail } from '../horario.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class HorarioData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Horario })
  data: Horario;
}

export class ResponseHorarioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: HorarioData })
  declare response: HorarioData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class HorarioDetailData {
  @ApiProperty({ type: HorarioDetail })
  data: HorarioDetail;
}

export class ResponseHorarioDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: HorarioDetailData })
  declare response: HorarioDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class HorariosData {
  @ApiProperty({ type: [Horario] })
  data?: Horario[];
}

export class ResponseHorariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: HorariosData })
  declare response: HorariosData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateHorariosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Horario] })
  data?: Horario[];
}

export class PaginateHorariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateHorariosData })
  declare response: PaginateHorariosData;
}
