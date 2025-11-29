import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { SucursalEntity } from '../sucursal.entity';

class SucursalData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: SucursalEntity })
  data?: SucursalEntity;
}
export class ResponseSucursalType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SucursalData })
  declare response: SucursalData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class SucursalesData extends OmitType(ResponseStructDTO, ['validationErrors', 'pagination']) {
  @ApiProperty({ type: [SucursalEntity] })
  data?: SucursalEntity[];
}

export class ResponseSucursalesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SucursalesData })
  declare response: SucursalesData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateSucursalesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [SucursalEntity] })
  data?: SucursalEntity[];
}

export class PaginateSucursalesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateSucursalesData })
  declare response: PaginateSucursalesData;
}
