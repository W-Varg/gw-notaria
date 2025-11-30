import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Banco, BancoDetail } from '../banco.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class BancoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Banco })
  data: Banco;
}

export class ResponseBancoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: BancoData })
  declare response: BancoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class BancoDetailData {
  @ApiProperty({ type: BancoDetail })
  data: BancoDetail;
}

export class ResponseBancoDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: BancoDetailData })
  declare response: BancoDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class BancosData {
  @ApiProperty({ type: [Banco] })
  data?: Banco[];
}

export class ResponseBancosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: BancosData })
  declare response: BancosData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateBancosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Banco] })
  data?: Banco[];
}

export class PaginateBancosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateBancosData })
  declare response: PaginateBancosData;
}
