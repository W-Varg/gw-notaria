import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoriaMensaje, EstadoMensaje } from './contacto.dto';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';
import { Usuario } from 'src/modules/admin/security/usuarios/usuario.entity';

export class MensajeContactoResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  usuarioId?: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  correo: string;

  @ApiProperty()
  telefono?: string;

  @ApiProperty()
  asunto: string;

  @ApiProperty()
  mensaje: string;

  @ApiProperty({ enum: CategoriaMensaje })
  categoria: CategoriaMensaje;

  @ApiProperty({ enum: EstadoMensaje })
  estado: EstadoMensaje;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  fechaActualizacion: Date;

  @ApiProperty({ type: Usuario })
  usuario?: Usuario;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class MensajeContactoData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: MensajeContactoResponse })
  data: MensajeContactoResponse;
}

export class ResponseMensajeContactoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MensajeContactoData })
  declare response: MensajeContactoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class MensajesContactoData {
  @ApiProperty({ type: [MensajeContactoResponse] })
  data?: MensajeContactoResponse[];
}

export class ResponseMensajesContactoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MensajesContactoData })
  declare response: MensajesContactoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PaginateMensajesContactoData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [MensajeContactoResponse] })
  data?: MensajeContactoResponse[];
}

export class PaginateMensajesContactoType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginateMensajesContactoData })
  declare response: PaginateMensajesContactoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class RespuestaMensajeData {
  @ApiProperty()
  data: {
    id: string;
    estado: EstadoMensaje;
    fechaActualizacion: Date;
    message: string;
  };
}

export class RespuestaMensajeResponse extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: RespuestaMensajeData })
  declare response: RespuestaMensajeData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class EstadisticasContactoData {
  @ApiProperty()
  data: {
    totalMensajes: number;
    mensajesNoLeidos: number;
    mensajesEnProceso: number;
    mensajesRespondidos: number;
    mensajesCerrados: number;
    distribucionPorCategoria: Record<CategoriaMensaje, number>;
    mensajesUltimos7Dias: number;
    tiempoPromedioRespuesta: number;
  };
}

export class EstadisticasContactoResponse extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: EstadisticasContactoData })
  declare response: EstadisticasContactoData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class MarcarLeidoData {
  @ApiProperty()
  data: {
    mensajesActualizados: number;
    message: string;
  };
}

export class MarcarLeidoResponse extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MarcarLeidoData })
  declare response: MarcarLeidoData;
}
