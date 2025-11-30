import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CuentaBancaria, CuentaBancariaDetail } from '../cuenta-bancaria.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class CuentaBancariaData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: CuentaBancaria })
  data: CuentaBancaria;
}

export class ResponseCuentaBancariaType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CuentaBancariaData })
  declare response: CuentaBancariaData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class CuentaBancariaDetailData {
  @ApiProperty({ type: CuentaBancariaDetail })
  data: CuentaBancariaDetail;
}

export class ResponseCuentaBancariaDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CuentaBancariaDetailData })
  declare response: CuentaBancariaDetailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class CuentasBancariasData {
  @ApiProperty({ type: [CuentaBancaria] })
  data?: CuentaBancaria[];
}

export class ResponseCuentasBancariasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: CuentasBancariasData })
  declare response: CuentasBancariasData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateCuentasBancariasData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [CuentaBancaria] })
  data?: CuentaBancaria[];
}

export class PaginateCuentasBancariasType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateCuentasBancariasData })
  declare response: PaginateCuentasBancariasData;
}
