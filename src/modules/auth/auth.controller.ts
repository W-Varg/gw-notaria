import { Controller, Post, Body, Get, Query, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {
  RegistrarUserInput,
  LoginUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  RefreshTokenInput,
  SendEmailLinkInput,
  SendWelcomeEmailInput,
  SendVerificationEmailInput,
  SendResetPasswordEmailInput,
  Verify2FAInput,
} from './dto/auth.input';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ResponseAuthType,
  ResponseLogoutType,
  ResponseForgotPasswordType,
  ResponseResetPasswordType,
  ResponseVerifyEmailType,
  ResponseSendEmailLinkType,
  ResponseSendWelcomeEmailType,
  ResponseSendVerificationEmailType,
  ResponseSendResetPasswordEmailType,
  ResponseRegisterType,
} from './dto/auth.resp';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guard';
import { Prisma } from 'src/generated/prisma/client';
import { dataResponseError } from 'src/common/dtos/response.dto';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';

@ApiTags('[auth] Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiDescription('Registrar un nuevo usuario', [])
  @ApiResponse({ status: 200, type: () => ResponseRegisterType })
  async register(@Body() inputDto: RegistrarUserInput) {
    return this.authService.registerUser(inputDto);
  }

  @Post('login')
  @ApiDescription('Iniciar sesión', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async login(@Body() inputDto: LoginUserInput) {
    return this.authService.login(inputDto);
  }

  @Post('logout')
  @BearerAuthPermision()
  @ApiDescription('Cerrar sesión', [])
  @ApiResponse({ status: 200, type: () => ResponseLogoutType })
  async logout(@AuthUser() session: IToken) {
    return this.authService.logout(session.usuarioId);
  }

  @Post('refresh')
  @ApiDescription('Renovar tokens de acceso', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async refresh(@Body() inputDto: RefreshTokenInput) {
    return this.authService.refresh(inputDto);
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

  @Post('2fa/verify')
  @ApiDescription('Verificar código 2FA durante el login', [])
  @ApiResponse({ status: 200, type: () => ResponseAuthType })
  async verify2FA(@Body() inputDto: Verify2FAInput) {
    return this.authService.verify2FA(inputDto);
  }

  @Post('resend-otp')
  @BearerAuthPermision()
  @ApiDescription('Reenviar código OTP por email', [])
  @ApiResponse({ status: 200, type: () => ResponseSendEmailLinkType })
  async resendOTP(@AuthUser() session: IToken) {
    return this.authService.resendOTP(session.usuarioId);
  }

  // ============================================
  // Endpoints de testing para envío de emails
  // ============================================

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
  // Endpoints para Google OAuth
  // ============================================

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiDescription('Iniciar autenticación con Google', [])
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiDescription('Callback de autenticación de Google', [])
  async googleCallback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: Request & { user?: Prisma.UsuarioModel },
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('appFrontUrlBase');

    // Si la respuesta ya fue enviada por el guard, no hacer nada más
    if (res.headersSent) {
      return;
    }

    if (!code) {
      const errorResponse = dataResponseError<null>('No se recibió el código de autorización');
      const errorJsonString = JSON.stringify(errorResponse);
      return res.redirect(
        `${frontendUrl}/auth/login?response=${encodeURIComponent(errorJsonString)}`,
      );
    }

    // Validar que req.user exista (el guard debería manejarlo, pero por seguridad)
    if (!req.user) {
      const errorResponse = dataResponseError<null>('No fue posible iniciar ingresar con google');
      const errorJsonString = JSON.stringify(errorResponse);
      return res.redirect(
        `${frontendUrl}/auth/login?response=${encodeURIComponent(errorJsonString)}`,
      );
    }

    const result = await this.authService.googleCallback(req.user as Prisma.UsuarioModel);

    if (result.error) {
      const errorResponse = dataResponseError<null>(result.message || 'Error de autenticación');
      const errorJsonString = JSON.stringify(errorResponse);
      return res.redirect(
        `${frontendUrl}/auth/login?response=${encodeURIComponent(errorJsonString)}`,
      );
    }

    // Redirigir al frontend con los tokens en formato JSON
    const successJsonString = JSON.stringify(result);
    return res.redirect(
      `${frontendUrl}/auth/callback?response=${encodeURIComponent(successJsonString)}`,
    );
  }
}
