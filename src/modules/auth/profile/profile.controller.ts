import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Req,
  Delete,
  Param,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
import { ResponseRolesType } from '../dto/auth.resp';
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

@ApiTags('[profile] Perfil de Usuario')
@Controller('auth/profile')
@BearerAuthPermision()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiDescription('Obtener información del usuario autenticado')
  @ApiResponse({ status: 200, type: () => ResponseUserType })
  async me(@Req() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.me(userId);
  }

  @Get('permissions')
  @ApiDescription('Obtener permisos del usuario autenticado', [])
  @ApiResponse({ status: 200, type: () => ResponsePermissionsType })
  async permissions(@Req() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.permissions(userId);
  }

  @Patch()
  @ApiDescription('Actualizar perfil de usuario', [])
  @ApiResponse({ status: 200, type: () => ResponseUpdateProfileType })
  async updateProfile(@Req() req: any, @Body() inputDto: UpdateProfileInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.updateProfile(userId, inputDto);
  }

  @Put('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  @ApiDescription('Subir/cambiar avatar del usuario', [])
  @ApiResponse({ status: 200, type: () => ResponseAvatarType })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage/avatars',
        filename: (req, file, cb) => {
          const userId = (req as any).userHeader?.usuarioId || 'temp';
          const ext = extname(file.originalname);
          cb(null, `${userId}-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async updateAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    const avatarPath = `/storage/avatars/${file.filename}`;
    return this.profileService.updateAvatar(userId, avatarPath);
  }

  @Post('verify-password')
  @ApiDescription('Verificar contraseña actual', [])
  @ApiResponse({ status: 200, type: () => ResponseVerifyPasswordType })
  async verifyPassword(@Req() req: any, @Body() inputDto: VerifyPasswordInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.verifyPassword(userId, inputDto);
  }

  @Get('sessions')
  @ApiDescription('Listar sesiones activas', [])
  @ApiResponse({ status: 200, type: () => ResponseSessionsType })
  async getSessions(@Req() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.getSessions(userId);
  }

  @Delete('sessions/:id')
  @ApiDescription('Cerrar sesión específica', [])
  @ApiResponse({ status: 200, type: () => ResponseDeleteSessionType })
  async closeSession(@Req() req: any, @Param('id') sessionId: string) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.closeSession(userId, sessionId);
  }

  @Delete('sessions')
  @ApiDescription('Cerrar todas las sesiones', [])
  @ApiResponse({ status: 200, type: () => ResponseDeleteSessionType })
  async closeAllSessions(@Req() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.closeAllSessions(userId);
  }

  @Get('login-history')
  @ApiDescription('Obtener historial de login', [])
  @ApiResponse({ status: 200, type: () => ResponseLoginHistoryType })
  async getLoginHistory(@Req() req: any, @Query() queryDto: GetLoginHistoryInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.getLoginHistory(userId, queryDto);
  }

  @Patch('change-password')
  @ApiDescription('Cambiar contraseña del usuario autenticado', [])
  @ApiResponse({ status: 200, type: () => ResponseChangePasswordType })
  async changePassword(@Req() req: any, @Body() inputDto: ChangePasswordInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.changePassword(userId, inputDto);
  }

  @Post('send-verification-link')
  @ApiDescription('Enviar enlace de verificación de email', [])
  @ApiResponse({ status: 200, type: () => ResponseSendVerificationLinkType })
  async sendVerificationLink(@Req() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.sendVerificationLink(userId);
  }

  // ============================================
  // Endpoints para Two-Factor Authentication (2FA)
  // ============================================

  @Get('2fa/setup')
  @ApiDescription('Generar código QR para configurar 2FA', [])
  @ApiResponse({ status: 200, type: () => Response2FASetupType })
  async setup2FA(@Req() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.setup2FA(userId);
  }

  @Post('2fa/enable')
  @ApiDescription('Habilitar 2FA después de verificar el código', [])
  @ApiResponse({ status: 200, type: () => ResponseMessage2FAType })
  async enable2FA(@Req() req: any, @Body() inputDto: Enable2FAInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.enable2FA(userId, inputDto);
  }

  @Post('2fa/disable')
  @ApiDescription('Desactivar 2FA', [])
  @ApiResponse({ status: 200, type: () => ResponseMessage2FAType })
  async disable2FA(@Req() req: any, @Body() inputDto: Disable2FAInput) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.disable2FA(userId, inputDto);
  }

  @Get('2fa/status')
  @ApiDescription('Obtener estado de 2FA del usuario', [])
  @ApiResponse({ status: 200, type: () => Response2FAStatusType })
  async get2FAStatus(@Req() req: any) {
    const userId = req.userHeader?.usuarioId?.toString() || 'temp-user-id';
    return this.profileService.get2FAStatus(userId);
  }
}
