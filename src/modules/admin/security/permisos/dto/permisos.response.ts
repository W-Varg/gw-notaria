/* ------------------------------------------------------------------------------------------------------------------ */

import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Permiso } from '../permisos.entity';
import { ApiOkResponseDto } from 'src/common/dtos/response.dto';

export class PermisosData {
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
export class PaginatePermisosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PermisosData })
  response: PermisosData;
}
