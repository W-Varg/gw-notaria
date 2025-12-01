import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ChangePasswordInput, Enable2FAInput, Disable2FAInput } from '../dto/auth.input';
import { UpdateProfileInput, VerifyPasswordInput, GetLoginHistoryInput } from './dto/profile.input';
import {
  ResponseUserType,
  ResponsePermissionsType,
  ResponseChangePasswordType,
  ResponseSendVerificationLinkType,
  Response2FASetupType,
  Response2FAStatusType,
  ResponseMessage2FAType,
} from './dto/profile.resp';
import {
  ResponseUpdateProfileType,
  ResponseVerifyPasswordType,
  ResponseSessionsType,
  ResponseLoginHistoryType,
  ResponseAvatarType,
  ResponseDeleteSessionType,
} from './dto/profile.resp';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { IToken, AuthUser } from 'src/common/decorators/token.decorator';

@ApiTags('[profile] Perfil de Usuario')
@Controller('auth/profile')
@BearerAuthPermision()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiDescription('Obtener información del usuario autenticado')
  @ApiResponse({ status: 200, type: () => ResponseUserType })
  async me(@AuthUser() session: IToken) {
    return this.profileService.me(session.usuarioId);
  }

  @Get('permissions')
  @ApiDescription('Obtener permisos del usuario autenticado', [])
  @ApiResponse({ status: 200, type: () => ResponsePermissionsType })
  async permissions(@AuthUser() session: IToken) {
    return this.profileService.permissions(session.usuarioId);
  }

  @Patch()
  @ApiDescription('Actualizar perfil de usuario', [])
  @ApiResponse({ status: 200, type: () => ResponseUpdateProfileType })
  async updateProfile(@AuthUser() session: IToken, @Body() inputDto: UpdateProfileInput) {
    return this.profileService.updateProfile(session.usuarioId, inputDto);
  }

  @Put('avatar')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  @ApiDescription('Subir/cambiar avatar del usuario', [])
  @ApiResponse({ status: 200, type: () => ResponseAvatarType })
  async updateAvatar(@AuthUser() session: IToken, @UploadedFile() avatar?: Express.Multer.File) {
    return this.profileService.updateAvatar(session.usuarioId, avatar);
  }

  @Post('verify-password')
  @ApiDescription('Verificar contraseña actual', [])
  @ApiResponse({ status: 200, type: () => ResponseVerifyPasswordType })
  async verifyPassword(@AuthUser() session: IToken, @Body() inputDto: VerifyPasswordInput) {
    return this.profileService.verifyPassword(session.usuarioId, inputDto);
  }

  @Get('sessions')
  @ApiDescription('Listar sesiones activas', [])
  @ApiResponse({ status: 200, type: () => ResponseSessionsType })
  async getSessions(@AuthUser() session: IToken) {
    return this.profileService.getSessions(session.usuarioId);
  }

  @Delete('sessions/:id')
  @ApiDescription('Cerrar sesión específica', [])
  @ApiResponse({ status: 200, type: () => ResponseDeleteSessionType })
  async closeSession(@AuthUser() session: IToken, @Param('id') sessionId: string) {
    return this.profileService.closeSession(session.usuarioId, sessionId);
  }

  @Delete('sessions')
  @ApiDescription('Cerrar todas las sesiones', [])
  @ApiResponse({ status: 200, type: () => ResponseDeleteSessionType })
  async closeAllSessions(@AuthUser() session: IToken) {
    return this.profileService.closeAllSessions(session.usuarioId);
  }

  @Get('login-history')
  @ApiDescription('Obtener historial de login', [])
  @ApiResponse({ status: 200, type: () => ResponseLoginHistoryType })
  async getLoginHistory(@AuthUser() session: IToken, @Query() queryDto: GetLoginHistoryInput) {
    return this.profileService.getLoginHistory(session.usuarioId, queryDto);
  }

  @Patch('change-password')
  @ApiDescription('Cambiar contraseña del usuario autenticado', [])
  @ApiResponse({ status: 200, type: () => ResponseChangePasswordType })
  async changePassword(@AuthUser() session: IToken, @Body() inputDto: ChangePasswordInput) {
    return this.profileService.changePassword(session.usuarioId, inputDto);
  }

  @Post('send-verification-link')
  @ApiDescription('Enviar enlace de verificación de email', [])
  @ApiResponse({ status: 200, type: () => ResponseSendVerificationLinkType })
  async sendVerificationLink(@AuthUser() session: IToken) {
    return this.profileService.sendVerificationLink(session.usuarioId);
  }

  // ============================================
  // Endpoints para Two-Factor Authentication (2FA)
  // ============================================

  @Get('2fa/setup')
  @ApiDescription('Generar código QR para configurar 2FA', [])
  @ApiResponse({ status: 200, type: () => Response2FASetupType })
  async setup2FA(@AuthUser() session: IToken) {
    return this.profileService.setup2FA(session.usuarioId);
  }

  @Post('2fa/enable')
  @ApiDescription('Habilitar 2FA después de verificar el código', [])
  @ApiResponse({ status: 200, type: () => ResponseMessage2FAType })
  async enable2FA(@AuthUser() session: IToken, @Body() inputDto: Enable2FAInput) {
    return this.profileService.enable2FA(session.usuarioId, inputDto);
  }

  @Post('2fa/disable')
  @ApiDescription('Desactivar 2FA', [])
  @ApiResponse({ status: 200, type: () => ResponseMessage2FAType })
  async disable2FA(@AuthUser() session: IToken, @Body() inputDto: Disable2FAInput) {
    console.log(session);

    return this.profileService.disable2FA(session.usuarioId, inputDto);
  }

  @Get('2fa/status')
  @ApiDescription('Obtener estado de 2FA del usuario', [])
  @ApiResponse({ status: 200, type: () => Response2FAStatusType })
  async get2FAStatus(@AuthUser() session: IToken) {
    return this.profileService.get2FAStatus(session.usuarioId);
  }
}
