import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../../common/dtos/response.dto';
import { Notificacion } from '../notificacion.entity';

// Respuesta individual
class NotificacionData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Notificacion })
  data: Notificacion;
}

export class ResponseNotificacionType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: NotificacionData })
  declare response: NotificacionData;
}

// Respuesta detallada (con relaciones)
export class ResponseNotificacionDetailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: NotificacionData })
  declare response: NotificacionData;
}

// Respuesta lista simple
class NotificacionesData {
  @ApiProperty({ type: [Notificacion] })
  data?: Notificacion[];
}

export class ResponseNotificacionesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: NotificacionesData })
  declare response: NotificacionesData;
}

// Respuesta lista paginada
class PaginateNotificacionesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [Notificacion] })
  data?: Notificacion[];
}

export class PaginateNotificacionesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateNotificacionesData })
  declare response: PaginateNotificacionesData;
}
