import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { compare, hash } from 'bcrypt';
import { toDataURL } from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { authenticator } from 'otplib';
import { ChangePasswordInput, Enable2FAInput, Disable2FAInput } from '../dto/auth.input';
import { UpdateProfileInput, VerifyPasswordInput } from './dto/profile.input';
import { TwoFactorSetup } from '../auth.entity';
import { EmailService } from '../../../global/emails/email.service';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@Injectable()
export class ProfileService {
  private readonly uploadPath = './storage/avatars';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
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

  private async saveAvatar(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = extname(file.originalname);
      const fileName = `avatar-${uuidv4()}${fileExtension}`;
      // si no existe la ruta uploadPath crear entonces
      if (!existsSync(this.uploadPath)) {
        mkdirSync(this.uploadPath, { recursive: true });
      }
      const filePath = join(this.uploadPath, fileName);

      // Guardar archivo
      writeFileSync(filePath, file.buffer);

      // Retornar URL relativa
      return `/storage/avatars/${fileName}`;
    } catch (error) {
      Logger.error('Error al guardar archivo de avatar:', error);
      throw new BadRequestException('Error al guardar el archivo de avatar');
    }
  }
  private async processAvatarUpload(file?: Express.Multer.File): Promise<string | null> {
    if (!file) return null;

    try {
      return await this.saveAvatar(file);
    } catch (error) {
      Logger.error('Error al guardar avatar:', error);
      throw new BadRequestException('Error al procesar el archivo de avatar');
    }
  }

  /**
   * Actualizar avatar del usuario
   */
  async updateAvatar(userId: string, file?: Express.Multer.File) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
    });

    const avatarPath = await this.processAvatarUpload(file);

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

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
   * Obtener historial de login con paginación
   */
  async getLoginHistory(userId: string, query: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    const [items, total] = await Promise.all([
      this.prismaService.historialLogin.findMany({
        where: { usuarioId: userId },
        select: {
          id: true,
          exitoso: true,
          ipAddress: true,
          dispositivo: true,
          navegador: true,
          ubicacion: true,
          motivoFallo: true,
          fechaIntento: true,
        },
        orderBy: { fechaIntento: 'desc' },
        skip,
        take,
      }),
      this.prismaService.historialLogin.count({
        where: { usuarioId: userId },
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
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                rolPermisos: {
                  include: {
                    permiso: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    // Extraer todos los permisos únicos
    const permissions = new Set<string>();
    user.roles.forEach((userRole) => {
      userRole.rol.rolPermisos.forEach((rolPermiso) => {
        permissions.add(rolPermiso.permiso.nombre);
      });
    });

    return dataResponseSuccess({ data: Array.from(permissions) });
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

    // Guardar el token
    await this.prismaService.configuracionSistema.upsert({
      where: { clave: `verify_token_${user.id}` },
      update: {
        valor: verifyToken,
        tipo: 'texto',
        descripcion: 'Token de verificación de email',
      },
      create: {
        clave: `verify_token_${user.id}`,
        valor: verifyToken,
        tipo: 'texto',
        descripcion: 'Token de verificación de email',
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

    // Generar la URL otpauth para el QR
    const otpauthUrl = authenticator.keyuri(user.email, 'TU-NOTARIA', secret);

    // Generar código QR como data URL
    const qrCodeUrl = await toDataURL(otpauthUrl);

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
