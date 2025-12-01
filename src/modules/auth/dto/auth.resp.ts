import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AuthUsuario, AuthResponse, UserProfile, TwoFactorSetup } from '../auth.entity';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

/* ------------------------------------------------------------------------------------------------------------------ */

class AuthRegisterData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: AuthUsuario })
  data: AuthUsuario;
}

export class ResponseRegisterType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: AuthRegisterData })
  declare response: AuthRegisterData;
}
/* ------------------------------------------------------------------------------------------------------------------ */

class AuthData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: AuthResponse })
  data: AuthResponse;
}

export class ResponseAuthType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: AuthData })
  declare response: AuthData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class ProfileData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: UserProfile })
  data: UserProfile;
}

export class ResponseProfileType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ProfileData })
  declare response: ProfileData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class RolesData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: [String] })
  data: string[];
}

export class ResponseRolesType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: RolesData })
  declare response: RolesData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class MessageData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseMessageType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MessageData })
  declare response: MessageData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class LogoutData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseLogoutType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: LogoutData })
  declare response: LogoutData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class ForgotPasswordData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseForgotPasswordType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ForgotPasswordData })
  declare response: ForgotPasswordData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class ResetPasswordData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseResetPasswordType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: ResetPasswordData })
  declare response: ResetPasswordData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class VerifyEmailData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseVerifyEmailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: VerifyEmailData })
  declare response: VerifyEmailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class SendEmailLinkData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseSendEmailLinkType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SendEmailLinkData })
  declare response: SendEmailLinkData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class SendWelcomeEmailData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseSendWelcomeEmailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SendWelcomeEmailData })
  declare response: SendWelcomeEmailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class SendVerificationEmailData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseSendVerificationEmailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SendVerificationEmailData })
  declare response: SendVerificationEmailData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class SendResetPasswordEmailData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: String })
  data: string;
}

export class ResponseSendResetPasswordEmailType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: SendResetPasswordEmailData })
  declare response: SendResetPasswordEmailData;
}
