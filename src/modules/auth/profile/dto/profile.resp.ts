import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos/response.dto';
import { ResponseStructDTO } from 'src/common/dtos/response.dto';
import { AuthUsuario, TwoFactorSetup } from '../../auth.entity';

/* ------------------------------------------------------------------------------------------------------------------ */

class UpdateProfileData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: AuthUsuario })
  data: AuthUsuario;
}

export class ResponseUpdateProfileType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: UpdateProfileData })
  declare response: UpdateProfileData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class VerifyPasswordData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: Boolean })
  data: boolean;
}

export class ResponseVerifyPasswordType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: VerifyPasswordData })
  declare response: VerifyPasswordData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

export class SesionEntity {
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

/* ------------------------------------------------------------------------------------------------------------------ */

class SesionesData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [SesionEntity] })
  data?: SesionEntity[];
}

export class ResponseSessionsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SesionesData })
  declare response: SesionesData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class LoginHistoryEntity {
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

class PaginatedLoginHistoryData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [LoginHistoryEntity] })
  data?: LoginHistoryEntity[];
}

export class ResponseLoginHistoryType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginatedLoginHistoryData })
  declare response: PaginatedLoginHistoryData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class AvatarData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseAvatarType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: AvatarData })
  declare response: AvatarData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class DeleteSessionData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseDeleteSessionType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: DeleteSessionData })
  declare response: DeleteSessionData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class ResendOTPData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseResendOTPType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ResendOTPData })
  declare response: ResendOTPData;
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
