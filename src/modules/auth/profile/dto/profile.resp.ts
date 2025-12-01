import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos/response.dto';
import { ResponseStructDTO } from 'src/common/dtos/response.dto';
import { AuthUsuario, UserProfile, TwoFactorSetup } from '../../auth.entity';

/**
 * Response para actualización de perfil
 */
export class ResponseUpdateProfileType {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Perfil actualizado exitosamente' })
  message: string;

  @ApiProperty({ example: { usuarioId: 'cuid123', nombre: 'Juan', apellidos: 'Pérez' } })
  data: any;
}

/**
 * Response para verificación de contraseña
 */
export class ResponseVerifyPasswordType {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Contraseña válida' })
  message: string;

  @ApiProperty({ example: true })
  data: boolean;
}

/**
 * Response para sesiones activas
 */
export class SessionResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dispositivo?: string;

  @ApiProperty()
  navegador?: string;

  @ApiProperty()
  ipAddress?: string;

  @ApiProperty()
  ubicacion?: string;

  @ApiProperty()
  estaActiva: boolean;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  ultimaActividad: Date;
}

export class ResponseSessionsType {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Sesiones obtenidas exitosamente' })
  message: string;

  @ApiProperty({ type: [SessionResponse] })
  data: SessionResponse[];
}

/**
 * Response para historial de login
 */
class LoginHistoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  exitoso: boolean;

  @ApiProperty()
  ipAddress?: string;

  @ApiProperty()
  dispositivo?: string;

  @ApiProperty()
  navegador?: string;

  @ApiProperty()
  ubicacion?: string;

  @ApiProperty()
  motivoFallo?: string;

  @ApiProperty()
  fechaIntento: Date;
}

export class PaginatedLoginHistoryResponse {
  @ApiProperty({ type: [LoginHistoryResponse] })
  items: LoginHistoryResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class ResponseLoginHistoryType {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Historial obtenido exitosamente' })
  message: string;

  @ApiProperty({ type: PaginatedLoginHistoryResponse })
  data: PaginatedLoginHistoryResponse;
}

/**
 * Response para avatar upload
 */
export class ResponseAvatarType {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Avatar actualizado exitosamente' })
  message: string;

  @ApiProperty({ example: { avatarUrl: '/storage/avatars/user123.jpg' } })
  data: { avatarUrl: string };
}

/**
 * Response para eliminación de sesión
 */
export class ResponseDeleteSessionType {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Sesión cerrada exitosamente' })
  message: string;

  @ApiProperty({ example: 'Sesión cerrada' })
  data: string;
}

/**
 * Response para OTP reenviado
 */
export class ResponseResendOTPType {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Código OTP reenviado exitosamente' })
  message: string;

  @ApiProperty({ example: 'OTP enviado' })
  data: string;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class UserData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: AuthUsuario })
  data: AuthUsuario;
}

export class ResponseUserType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: UserData })
  declare response: UserData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class PermissionsData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: [String] })
  data: string[];
}

export class ResponsePermissionsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PermissionsData })
  declare response: PermissionsData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class ChangePasswordData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseChangePasswordType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ChangePasswordData })
  declare response: ChangePasswordData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class SendVerificationLinkData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseSendVerificationLinkType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SendVerificationLinkData })
  declare response: SendVerificationLinkData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class TwoFactorSetupData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: TwoFactorSetup })
  data: TwoFactorSetup;
}

export class Response2FASetupType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TwoFactorSetupData })
  declare response: TwoFactorSetupData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class TwoFactorStatusData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Boolean })
  data: boolean;
}

export class Response2FAStatusType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: TwoFactorStatusData })
  declare response: TwoFactorStatusData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class Message2FAData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseMessage2FAType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: Message2FAData })
  declare response: Message2FAData;
}
