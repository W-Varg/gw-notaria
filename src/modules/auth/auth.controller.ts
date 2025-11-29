import { Controller, Post, Body, Get, Patch, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegistrarUserInput,
  LoginUserInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  RefreshTokenInput,
  SendEmailLinkInput,
  SendWelcomeEmailInput,
  SendVerificationEmailInput,
  SendResetPasswordEmailInput,
  Enable2FAInput,
  Verify2FAInput,
  Disable2FAInput,
} from './dto/auth.input';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ResponseAuthType,
  ResponseUserType,
  ResponseRolesType,
  ResponsePermissionsType,
  ResponseLogoutType,
  ResponseChangePasswordType,
  ResponseForgotPasswordType,
  ResponseResetPasswordType,
  ResponseVerifyEmailType,
  ResponseSendEmailLinkType,
  ResponseSendWelcomeEmailType,
  ResponseSendVerificationEmailType,
  ResponseSendResetPasswordEmailType,
  ResponseSendVerificationLinkType,
  Response2FASetupType,
  Response2FAStatusType,
  ResponseMessage2FAType,
} from './dto/auth.resp';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';

@ApiTags('[auth] Registro y Autorización')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiDescription('Registrar un nuevo usuario', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async register(@Body() inputDto: RegistrarUserInput) {
    return this.authService.registerUser(inputDto);
  }

  @Post('login')
  @ApiDescription('servicio para iniciar sesión', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async login(@Body() inputDto: LoginUserInput) {
    return this.authService.login(inputDto);
  }

  @Post('logout')
  @BearerAuthPermision()
  @ApiDescription('Cerrar sesión', [])
  @ApiResponse({ status: 200, type: () => ResponseLogoutType })
  async logout(@Request() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @ApiDescription('Renovar tokens de acceso', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async refresh(@Body() inputDto: RefreshTokenInput) {
    return this.authService.refresh(inputDto);
  }

  @Get('me')
  @BearerAuthPermision()
  @ApiDescription('Obtener información del usuario autenticado')
  @ApiResponse({ status: 200, type: () => ResponseUserType })
  async me(@Request() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.me(userId);
  }

  @Get('roles')
  @BearerAuthPermision()
  @ApiDescription('Obtener roles del usuario autenticado', [])
  @ApiResponse({ status: 200, type: () => ResponseRolesType })
  async roles(@Request() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.roles(userId);
  }

  @Get('permissions')
  @BearerAuthPermision()
  @ApiDescription('Obtener permisos del usuario autenticado', [])
  @ApiResponse({ status: 200, type: () => ResponsePermissionsType })
  async permissions(@Request() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.permissions(userId);
  }

  @Patch('change-password')
  @BearerAuthPermision()
  @ApiDescription('Cambiar contraseña del usuario autenticado', [])
  @ApiResponse({ status: 200, type: () => ResponseChangePasswordType })
  async changePassword(@Request() req: any, @Body() inputDto: ChangePasswordInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.changePassword(userId, inputDto);
  }

  @Post('forgot-password')
  @ApiDescription('Solicitar reset de contraseña', [])
  @ApiResponse({ status: 200, type: () => ResponseForgotPasswordType })
  async forgotPassword(@Body() inputDto: ForgotPasswordInput) {
    return this.authService.forgotPassword(inputDto);
  }

  @Post('reset-password')
  @ApiDescription('Restablecer contraseña con token', [])
  @ApiResponse({ status: 200, type: () => ResponseResetPasswordType })
  async resetPassword(@Body() inputDto: ResetPasswordInput) {
    return this.authService.resetPassword(inputDto);
  }

  @Post('verify-email')
  @ApiDescription('Verificar email con token', [])
  @ApiResponse({ status: 200, type: () => ResponseVerifyEmailType })
  async verifyEmail(@Body() inputDto: VerifyEmailInput) {
    return this.authService.verifyEmail(inputDto);
  }

  @Post('send-verification-link')
  @BearerAuthPermision()
  @ApiDescription('Enviar enlace de verificación de email', [])
  @ApiResponse({ status: 200, type: () => ResponseSendVerificationLinkType })
  async sendVerificationLink(@Request() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.sendVerificationLink(userId);
  }

  @Post('send-reset-password-link')
  @ApiDescription('Enviar enlace de reset de contraseña', [])
  @ApiResponse({ status: 200, type: () => ResponseSendEmailLinkType })
  async sendResetPasswordLink(@Body() body: SendEmailLinkInput) {
    return this.authService.sendResetPasswordLink(body.email);
  }

  @Post('send-forgot-password-link')
  @ApiDescription('Enviar enlace de olvido de contraseña', [])
  @ApiResponse({ status: 200, type: () => ResponseSendEmailLinkType })
  async sendForgotPasswordLink(@Body() body: SendEmailLinkInput) {
    return this.authService.sendForgotPasswordLink(body.email);
  }

  @Post('send-welcome-email')
  @ApiDescription('Enviar email de bienvenida', [])
  @ApiResponse({ status: 200, type: () => ResponseSendWelcomeEmailType })
  async sendWelcomeEmail(@Body() body: SendWelcomeEmailInput) {
    return this.authService.sendWelcomeEmail(body.email, body.name);
  }

  @Post('send-verification-email')
  @ApiDescription('Enviar email de verificación', [])
  @ApiResponse({ status: 200, type: () => ResponseSendVerificationEmailType })
  async sendVerificationEmail(@Body() body: SendVerificationEmailInput) {
    return this.authService.sendVerificationEmail(body.email, body.token);
  }

  @Post('send-reset-password-email')
  @ApiDescription('Enviar email de reset de contraseña', [])
  @ApiResponse({ status: 200, type: () => ResponseSendResetPasswordEmailType })
  async sendResetPasswordEmail(@Body() body: SendResetPasswordEmailInput) {
    return this.authService.sendResetPasswordEmail(body.email, body.token);
  }

  @Post('send-forgot-password-email')
  @ApiDescription('Enviar email de olvido de contraseña', [])
  @ApiResponse({ status: 200, type: () => ResponseSendResetPasswordEmailType })
  async sendForgotPasswordEmail(@Body() body: SendResetPasswordEmailInput) {
    return this.authService.sendForgotPasswordEmail(body.email, body.token);
  }

  // ============================================
  // Endpoints para Two-Factor Authentication (2FA)
  // ============================================

  @Get('2fa/setup')
  @BearerAuthPermision()
  @ApiDescription('Generar código QR para configurar 2FA', [])
  @ApiResponse({ status: 200, type: () => Response2FASetupType })
  async setup2FA(@Request() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.setup2FA(userId);
  }

  @Post('2fa/enable')
  @BearerAuthPermision()
  @ApiDescription('Habilitar 2FA después de verificar el código', [])
  @ApiResponse({ status: 200, type: () => ResponseMessage2FAType })
  async enable2FA(@Request() req: any, @Body() inputDto: Enable2FAInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.enable2FA(userId, inputDto);
  }

  @Post('2fa/verify')
  @ApiDescription('Verificar código 2FA durante el login', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async verify2FA(@Body() inputDto: Verify2FAInput) {
    return this.authService.verify2FA(inputDto);
  }

  @Post('2fa/disable')
  @BearerAuthPermision()
  @ApiDescription('Desactivar 2FA', [])
  @ApiResponse({ status: 200, type: () => ResponseMessage2FAType })
  async disable2FA(@Request() req: any, @Body() inputDto: Disable2FAInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.disable2FA(userId, inputDto);
  }

  @Get('2fa/status')
  @BearerAuthPermision()
  @ApiDescription('Obtener estado de 2FA del usuario', [])
  @ApiResponse({ status: 200, type: () => Response2FAStatusType })
  async get2FAStatus(@Request() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.authService.get2FAStatus(userId);
  }

  @Get('google/callback')
  @ApiDescription('Callback de autenticación de Google', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async googleCallback(@Query('code') code: string) {
    return this.authService.googleCallback(code);
  }
}
