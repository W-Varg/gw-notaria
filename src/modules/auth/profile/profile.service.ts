import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../global/database/prisma.service';

import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { randomBytes } from 'node:crypto';
import { compare, hash } from 'bcrypt';
import { authenticator } from 'otplib';
import { ChangePasswordInput, Enable2FAInput, Disable2FAInput } from '../dto/auth.input';
import {
  UpdateProfileInput,
  VerifyPasswordInput,
  ListHistorialLoginArgsDto,
} from './dto/profile.input';
import { TwoFactorSetup } from '../auth.entity';
import { EmailService } from '../../../global/emails/email.service';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { TokenTemporalTipoEnum, TokenTemporalClaveEnum } from 'src/enums';
import { FileStorageService } from 'src/global/services/file-storage.service';
import { QrCodeService } from 'src/global/services/qr-code.service';
import { UserValidationService } from 'src/global/services/user-validation.service';
import dayjs from 'dayjs';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly fileStorageService: FileStorageService,
    private readonly qrCodeService: QrCodeService,
    private readonly userValidationService: UserValidationService,
  ) {}

  /**
   * Obtener información del usuario autenticado
   */
  async me(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { rol: { include: { rolPermisos: { include: { permiso: true } } } } } },
      },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }
    if (!user.estaActivo) return dataResponseError('El usuario aun nose encuentra activado');

    // Remover contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    return dataResponseSuccess({ data: userWithoutPassword });
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: string, inputDto: UpdateProfileInput) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    // Actualizar solo los campos proporcionados
    const updatedUser = await this.prismaService.usuario.update({
      where: { id: userId },
      data: {
        ...(inputDto.nombre && { nombre: inputDto.nombre }),
        ...(inputDto.apellidos && { apellidos: inputDto.apellidos }),
        ...(inputDto.telefono !== undefined && { telefono: inputDto.telefono }),
        ...(inputDto.direccion !== undefined && { direccion: inputDto.direccion }),
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
        telefono: true,
        direccion: true,
        avatar: true,
      },
    });

    return dataResponseSuccess(
      { data: updatedUser },
      { message: 'Perfil actualizado exitosamente' },
    );
  }

  /**
   * Actualizar avatar del usuario
   */
  async updateAvatar(userId: string, file?: Express.Multer.File) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    const avatarPath = await this.fileStorageService.processAvatarUpload(file);

    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { avatar: avatarPath },
    });

    return dataResponseSuccess(
      { data: { avatarUrl: avatarPath } },
      { message: 'Avatar actualizado exitosamente' },
    );
  }

  /**
   * Verificar contraseña actual
   */
  async verifyPassword(userId: string, inputDto: VerifyPasswordInput) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    const isValid = await compare(inputDto.password, user.password);

    if (!isValid) {
      return dataResponseError('Contraseña incorrecta');
    }

    return dataResponseSuccess({ data: true }, { message: 'Contraseña válida' });
  }

  /**
   * Obtener sesiones activas del usuario
   */
  async getSessions(userId: string) {
    const sessions = await this.prismaService.sesion.findMany({
      where: { usuarioId: userId, estaActiva: true },
      select: {
        id: true,
        dispositivo: true,
        navegador: true,
        ipAddress: true,
        ubicacion: true,
        estaActiva: true,
        fechaCreacion: true,
        ultimaActividad: true,
      },
      orderBy: { ultimaActividad: 'desc' },
    });

    return dataResponseSuccess({ data: sessions });
  }

  /**
   * Cerrar una sesión específica
   */
  async closeSession(userId: string, sessionId: string) {
    const session = await this.prismaService.sesion.findFirst({
      where: { id: sessionId, usuarioId: userId },
    });

    if (!session) {
      return dataResponseError('Sesión no encontrada');
    }

    await this.prismaService.sesion.update({
      where: { id: sessionId },
      data: { estaActiva: false },
    });

    return dataResponseSuccess({ data: 'Sesión cerrada exitosamente' });
  }

  /**
   * Cerrar todas las sesiones del usuario
   */
  async closeAllSessions(userId: string) {
    await this.prismaService.sesion.updateMany({
      where: { usuarioId: userId, estaActiva: true },
      data: { estaActiva: false },
    });

    return dataResponseSuccess({ data: 'Todas las sesiones han sido cerradas' });
  }

  /**
   * Obtener historial de login con paginación y filtros
   */
  async getLoginHistory(userId: string, query: ListHistorialLoginArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    // Construir el where combinando el userId con los filtros del where input
    const whereCondition = {
      usuarioId: userId,
      ...(query.where || {}),
    };

    const [items, total] = await Promise.all([
      this.prismaService.historialLogin.findMany({
        where: whereCondition,
        select: query.select || {
          id: true,
          exitoso: true,
          ipAddress: true,
          userAgent: true,
          dispositivo: true,
          navegador: true,
          ubicacion: true,
          motivoFallo: true,
          fechaIntento: true,
        },
        orderBy: orderBy || { fechaIntento: 'desc' },
        skip,
        take,
      }),
      this.prismaService.historialLogin.count({
        where: whereCondition,
      }),
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<any[]>({
      data: items,
      pagination,
    });
  }

  /**
   * Obtener permisos del usuario autenticado
   */
  async permissions(userId: string) {
    const user = await this.userValidationService.getUserWithRelations(userId);

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    const permissions = this.userValidationService.extractUniquePermissions(user.roles);

    return dataResponseSuccess({ data: permissions });
  }

  /**
   * Cambiar contraseña del usuario autenticado
   */
  async changePassword(userId: string, inputDto: ChangePasswordInput) {
    const { currentPassword, newPassword } = inputDto;

    // Buscar el usuario
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    // Verificar la contraseña actual
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return dataResponseError('Contraseña actual incorrecta');
    }

    // Encriptar la nueva contraseña
    const hashedNewPassword = await hash(newPassword, 10);

    // Actualizar la contraseña
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return dataResponseSuccess({ data: 'Contraseña actualizada exitosamente' });
  }

  /**
   * Enviar enlace de verificación de email
   */
  async sendVerificationLink(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) return dataResponseError('Usuario no encontrado');
    if (user.emailVerificado) return dataResponseError('El email ya está verificado');

    // Generar token de verificación
    const verifyToken = randomBytes(32).toString('hex');
    const expirationTime = dayjs().add(24, 'hour').toDate(); // 24 horas

    // Guardar el token
    await this.prismaService.tokenTemporal.upsert({
      where: {
        usuarioId_tipo: {
          usuarioId: user.id,
          tipo: TokenTemporalTipoEnum.VERIFICACION_EMAIL,
        },
      },
      update: {
        clave: TokenTemporalClaveEnum.VERIFY_TOKEN,
        valor: verifyToken,
        fechaExpiracion: expirationTime,
      },
      create: {
        clave: TokenTemporalClaveEnum.VERIFY_TOKEN,
        valor: verifyToken,
        tipo: TokenTemporalTipoEnum.VERIFICACION_EMAIL,
        usuarioId: user.id,
        fechaExpiracion: expirationTime,
      },
    });

    // Enviar email de verificación usando EmailService
    await this.emailService.sendVerificationEmail(user.email, user.nombre, verifyToken);

    return dataResponseSuccess({ data: 'Enlace de verificación enviado' });
  }

  // ============================================
  // Métodos para Two-Factor Authentication (2FA)
  // ============================================

  /**
   * Genera el secreto y código QR para configurar 2FA
   */
  async setup2FA(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: { email: true, nombre: true, apellidos: true, twoFactorEnabled: true },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    if (user.twoFactorEnabled) {
      return dataResponseError(
        '2FA ya está habilitado. Desactívalo primero si deseas reconfigurarlo.',
      );
    }

    // Generar secreto TOTP
    const secret = authenticator.generateSecret();

    // Guardar temporalmente el secreto (sin habilitar 2FA aún)
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    // Crear el nombre de la aplicación para Google Authenticator
    const appName = `TU-NOTARIA (${user.email})`;

    // Generar código QR usando el servicio compartido
    const qrCodeUrl = await this.qrCodeService.generate2FAQrCode(user.email, 'TU-NOTARIA', secret);

    const setupData: TwoFactorSetup = {
      qrCodeUrl,
      secret,
      appName,
    };

    return dataResponseSuccess<TwoFactorSetup>({ data: setupData });
  }

  /**
   * Habilita 2FA después de verificar el código
   */
  async enable2FA(userId: string, inputDto: Enable2FAInput) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: {
        email: true,
        nombre: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    if (user.twoFactorEnabled) {
      return dataResponseError('2FA ya está habilitado');
    }

    if (!user.twoFactorSecret) {
      return dataResponseError('Primero debes configurar 2FA usando /profile/2fa/setup');
    }

    // Verificar el código TOTP
    const isValid = authenticator.verify({
      token: inputDto.code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      return dataResponseError('Código de verificación inválido');
    }

    // Habilitar 2FA
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    // Enviar email de confirmación de 2FA
    await this.emailService.send2FASetupEmail(user.email, user.nombre);

    return dataResponseSuccess<string>({ data: '2FA habilitado exitosamente' });
  }

  /**
   * Desactiva 2FA después de verificar la contraseña
   */
  async disable2FA(userId: string, inputDto: Disable2FAInput) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: { password: true, twoFactorEnabled: true },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    if (!user.twoFactorEnabled) {
      return dataResponseError('2FA no está habilitado');
    }

    // Verificar la contraseña
    const isPasswordValid = await compare(inputDto.password, user.password);
    if (!isPasswordValid) {
      return dataResponseError('Contraseña incorrecta');
    }

    // Desactivar 2FA y eliminar el secreto
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    return dataResponseSuccess<string>({ data: '2FA deshabilitado exitosamente' });
  }

  /**
   * Obtiene el estado de 2FA del usuario
   */
  async get2FAStatus(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    return dataResponseSuccess<boolean>({ data: user.twoFactorEnabled });
  }
}
