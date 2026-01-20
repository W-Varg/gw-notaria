import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Usuario, UsuarioDetail } from '../usuario.entity';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../../common/dtos/response.dto';

class UsuarioData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Usuario })
  data: Usuario;
}

export class ResponseUsuarioType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: UsuarioData })
  declare response: UsuarioData;
}

/* ------------------------------------------------------------------------------------------------------------------ */
class UsuarioDetailData {
  @ApiProperty({ type: UsuarioDetail })
  data: UsuarioDetail;
}

export class ResponseUsuarioDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: UsuarioDetailData })
  declare response: UsuarioDetailData;
}
/* ------------------------------------------------------------------------------------------------------------------ */

class UsuariosData {
  @ApiProperty({ type: [Usuario] })
  data?: Usuario[];
}

export class ResponseUsuariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: UsuariosData })
  declare response: UsuariosData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateUsuariosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Usuario] })
  data?: Usuario[];
}

export class PaginateUsuariosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateUsuariosData })
  declare response: PaginateUsuariosData;
}
