/* ------------------------------------------------------------------------------------------------------------------ */

import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Permiso } from '../permisos.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

class PermisosData {
  @ApiProperty({ type: [Permiso] })
  data?: Permiso[];
}

export class ResponsePermisosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PermisosData })
  response: PermisosData;
}

/* ------------------------------------------------------------------------------------------------------------------ */
class MessageData {
  @ApiProperty({ type: PermisosData })
  data?: PermisosData;
}

export class ResponseMessageType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MessageData })
  response: MessageData;
}

/* ------------------------------------------------------------------------------------------------------------------ */
class PaginatePermisosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Permiso] })
  data?: Permiso[];
}

export class PaginatePermisosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginatePermisosData })
  response: PaginatePermisosData;
}

/* ------------------------------------------------------------------------------------------------------------------ */
class PermisoDetailData {
  @ApiProperty({ type: Permiso })
  data?: Permiso;
}

export class ResponsePermisoDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PermisoDetailData })
  response: PermisoDetailData;
}
