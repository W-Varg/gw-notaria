import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
import { dataResponseError, dataResponseSuccess, ResponseDTO } from 'src/common/dtos/response.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import {
  RegistrarUserInput,
  LoginUserInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  RefreshTokenInput,
  Enable2FAInput,
  Verify2FAInput,
  Disable2FAInput,
} from './dto/auth.input';
import { AuthResponse, UserProfile, TwoFactorSetup, GoogleUserData, AuthUser } from './auth.entity';
import { TokenService } from '../../common/guards/token-auth.service';
import { EmailService } from '../../global/emails/email.service';
import { Usuario as UserModel } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(inputDto: RegistrarUserInput) {
    const { email, password, ...userData } = inputDto;

    // Verificar si el email ya existe
    const existingUser = await this.prismaService.usuario.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return dataResponseError('El correo electrónico ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario (inactivo hasta que verifique el email)
    const user = await this.prismaService.usuario.create({
      data: {
        ...userData,
        email,
        password: hashedPassword,
        emailVerificado: false,
        estaActivo: false,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
      },
    });

    // Generar token de verificación
    const verifyToken = crypto.randomBytes(32).toString('hex');

    // Guardar el token de verificación
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

    // Enviar email de verificación usando el EmailService
    await this.emailService.sendVerificationEmail(user.email, user.nombre, verifyToken);

    return dataResponseSuccess({ data: user }, { message: 'Usuario registrado exitosamente' });
  }

  async login(inputDto: LoginUserInput) {
    const { email, password } = inputDto;

    // Buscar usuario por email con todas las relaciones necesarias
    const user = await this.prismaService.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        estaActivo: true,
        nombre: true,
        apellidos: true,
        telefono: true,
        direccion: true,
        avatar: true,
        emailVerificado: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
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
      return dataResponseError('no existe el usuario');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return dataResponseError('Credenciales inválidas');
    }

    // Verificar que el email esté verificado
    if (!user.emailVerificado) {
      return dataResponseError(
        'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.',
      );
    }

    // Verificar que el usuario esté activo
    if (!user.estaActivo) {
      return dataResponseError('Tu cuenta se encuentra inactiva. Contacta al administrador.');
    }

    // Si el usuario tiene 2FA habilitado (Google Authenticator)
    if (user.twoFactorEnabled) {
      const partialResponse: AuthResponse = {
        accessToken: '',
        refreshToken: '',
        user: {
          usuarioId: user.id,
          email: user.email,
          nombre: user.nombre,
          apellidos: user.apellidos,
          estaActivo: user.estaActivo,
          emailVerificado: user.emailVerificado,
          telefono: user.telefono || null,
          direccion: user.direccion || null,
          avatar: user.avatar || null,
          twoFactorEnabled: true,
        },
        requiresTwoFactor: true,
        otpMethod: 'authenticator', // Indica que debe usar Google Authenticator
      };
      return dataResponseSuccess<AuthResponse>(
        { data: partialResponse },
        { message: 'Introduce el codigo de vericacion de google' },
      );
    }

    // Si twoFactorEnabled está desactivado, enviar OTP por email
    if (!user.twoFactorEnabled && user.emailVerificado) {
      // Generar código OTP de 6 dígitos
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Guardar OTP en configuración del sistema con expiración de 10 minutos
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
      await this.prismaService.configuracionSistema.upsert({
        where: { clave: `otp_email_${user.id}` },
        update: {
          valor: JSON.stringify({ code: otpCode, expiresAt: expirationTime.toISOString() }),
          tipo: 'json',
          descripcion: 'OTP temporal para login por email',
        },
        create: {
          clave: `otp_email_${user.id}`,
          valor: JSON.stringify({ code: otpCode, expiresAt: expirationTime.toISOString() }),
          tipo: 'json',
          descripcion: 'OTP temporal para login por email',
        },
      });

      // Enviar OTP por email
      await this.emailService.sendOTPEmail(user.email, user.nombre, otpCode);

      const partialResponse: AuthResponse = {
        accessToken: '',
        refreshToken: '',
        user: {
          usuarioId: user.id,
          email: user.email,
          nombre: user.nombre,
          apellidos: user.apellidos,
          estaActivo: user.estaActivo,
          emailVerificado: user.emailVerificado,
          telefono: user.telefono || null,
          direccion: user.direccion || null,
          avatar: user.avatar || null,
          twoFactorEnabled: false,
        },
        requiresTwoFactor: true,
        otpMethod: 'email', // Indica que debe usar código por email
      };
      return dataResponseSuccess<AuthResponse>(
        { data: partialResponse },
        { message: 'se envió un código de verificacion a tu correo electrónico' },
      );
    }

    const tokens = await this.tokenService.generateTokens(user);

    // Construir perfil de usuario
    const userProfile: UserProfile = {
      usuarioId: user.id,
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      estaActivo: user.estaActivo,
      emailVerificado: user.emailVerificado,
      telefono: user.telefono || null,
      direccion: user.direccion || null,
      avatar: user.avatar || null,
      twoFactorEnabled: user.twoFactorEnabled,
    };

    // Extraer permisos únicos
    const permissions = new Set<string>();
    user.roles.forEach((userRole) => {
      userRole.rol.rolPermisos.forEach((rolPermiso) => {
        permissions.add(rolPermiso.permiso.nombre);
      });
    });

    // Construir respuesta de autenticación
    const response: AuthResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userProfile,
      permissions: Array.from(permissions),
      roles: user.roles.map((userRole) => userRole.rol.nombre),
    };

    return dataResponseSuccess<AuthResponse>({ data: response });
  }

  logout(_userId: string) {
    // En un sistema real, aquí invalidarías el refresh token
    // Por simplicidad, solo retornamos un mensaje de éxito
    return dataResponseSuccess<string>({ data: 'Sesión cerrada exitosamente' });
  }

  async refresh(inputDto: RefreshTokenInput) {
    const { refreshToken } = inputDto;

    try {
      // Verificar el refresh token
      const payload = this.tokenService.verifyRefreshToken(refreshToken);

      // Buscar el usuario
      const user = await this.prismaService.usuario.findUnique({
        where: { id: payload.usuarioId },
        select: {
          id: true,
          email: true,
          estaActivo: true,
          nombre: true,
          apellidos: true,
          telefono: true,
          direccion: true,
          avatar: true,
          emailVerificado: true,
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

      if (!user || !user.estaActivo) {
        return dataResponseError('Token inválido');
      }

      const tokens = await this.tokenService.generateTokens(user);

      // Construir perfil de usuario
      const userProfile: UserProfile = {
        usuarioId: user.id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        estaActivo: user.estaActivo,
        emailVerificado: user.emailVerificado,
        telefono: user.telefono || null,
        direccion: user.direccion || null,
        avatar: user.avatar || null,
      };

      // Extraer permisos únicos
      const permissions = new Set<string>();
      user.roles.forEach((userRole) => {
        userRole.rol.rolPermisos.forEach((rolPermiso) => {
          permissions.add(rolPermiso.permiso.nombre);
        });
      });

      // Construir respuesta de autenticación
      const response: AuthResponse = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        roles: user.roles.map((userRole) => userRole.rol.nombre),
        permissions: Array.from(permissions),
        user: userProfile,
      };

      return dataResponseSuccess<AuthResponse>({ data: response });
    } catch (_error) {
      Logger.error(_error, 'AuthService.refresh');
      return dataResponseError('Token de refresh inválido');
    }
  }

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

  async roles(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    const roles = user.roles.map((userRole) => userRole.rol.nombre);
    return dataResponseSuccess({ data: roles });
  }

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
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return dataResponseError('Contraseña actual incorrecta');
    }

    // Encriptar la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return dataResponseSuccess({ data: 'Contraseña actualizada exitosamente' });
  }

  async forgotPassword(inputDto: ForgotPasswordInput) {
    const { email } = inputDto;

    // Buscar el usuario
    const user = await this.prismaService.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return dataResponseSuccess({
        data: 'Si el email se encuentra registrado en nuestro sistema entonces se enviará un enlace de recuperación',
      });
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Guardar el token (en un sistema real, usarías una tabla separada)
    // Por simplicidad, usaremos un campo en la configuración del sistema
    await this.prismaService.configuracionSistema.upsert({
      where: { clave: `reset_token_${user.id}` },
      update: {
        valor: resetToken,
        tipo: 'texto',
        descripcion: 'Token de reset de contraseña',
      },
      create: {
        clave: `reset_token_${user.id}`,
        valor: resetToken,
        tipo: 'texto',
        descripcion: 'Token de reset de contraseña',
      },
    });

    // Enviar email de reset usando EmailService
    await this.emailService.sendResetPasswordEmail(user.email, user.nombre, resetToken);

    return dataResponseSuccess({
      data: 'Si el email existe, se enviará un enlace de recuperación',
    });
  }

  async resetPassword(inputDto: ResetPasswordInput) {
    const { token, newPassword } = inputDto;

    // Buscar el token en la configuración del sistema
    const tokenConfig = await this.prismaService.configuracionSistema.findFirst({
      where: {
        clave: { startsWith: 'reset_token_' },
        valor: token,
      },
    });

    if (!tokenConfig) {
      return dataResponseError('Token de reset inválido o expirado');
    }

    // Extraer el ID del usuario del clave
    const userId = tokenConfig.clave.replace('reset_token_', '');

    // Encriptar la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Eliminar el token usado
    await this.prismaService.configuracionSistema.delete({
      where: { id: tokenConfig.id },
    });

    return dataResponseSuccess({ data: 'Contraseña restablecida exitosamente' });
  }

  async verifyEmail(inputDto: VerifyEmailInput) {
    const { token } = inputDto;

    // Buscar el token en la configuración del sistema
    const tokenConfig = await this.prismaService.configuracionSistema.findFirst({
      where: {
        clave: { startsWith: 'verify_token_' },
        valor: token,
      },
    });

    if (!tokenConfig) {
      return dataResponseError('Token de verificación inválido o expirado');
    }

    // Extraer el ID del usuario del clave
    const userId = tokenConfig.clave.replace('verify_token_', '');

    // Obtener datos del usuario
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: { nombre: true, email: true },
    });

    // Marcar el email como verificado
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { emailVerificado: true },
    });

    // Eliminar el token usado
    await this.prismaService.configuracionSistema.delete({
      where: { id: tokenConfig.id },
    });

    // Enviar email de bienvenida
    if (user) {
      await this.emailService.sendWelcomeEmail(user.email, user.nombre);
    }

    return dataResponseSuccess({ data: 'Email verificado exitosamente' });
  }

  async sendVerificationLink(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) return dataResponseError('Usuario no encontrado');
    if (user.emailVerificado) return dataResponseError('El email ya está verificado');

    // Generar token de verificación
    const verifyToken = crypto.randomBytes(32).toString('hex');

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

  async sendResetPasswordLink(email: string) {
    return this.forgotPassword({ email });
  }

  async sendForgotPasswordLink(email: string) {
    return this.forgotPassword({ email });
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.emailService.sendWelcomeEmail(email, name);
    return dataResponseSuccess<string>({ data: 'Email de bienvenida enviado' });
  }

  async sendVerificationEmail(email: string, token: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { email },
      select: { nombre: true },
    });

    const userName = user?.nombre || 'Usuario';
    await this.emailService.sendVerificationEmail(email, userName, token);
    return dataResponseSuccess<string>({ data: 'Email de verificación enviado' });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { email },
      select: { nombre: true },
    });

    const userName = user?.nombre || 'Usuario';
    await this.emailService.sendResetPasswordEmail(email, userName, token);
    return dataResponseSuccess<string>({ data: 'Email de reset enviado' });
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    return this.sendResetPasswordEmail(email, token);
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
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

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
      return dataResponseError('Primero debes configurar 2FA usando /auth/2fa/setup');
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
   * Verifica el código 2FA durante el login
   */
  async verify2FA(inputDto: Verify2FAInput) {
    const { userId, code } = inputDto;

    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
        telefono: true,
        direccion: true,
        avatar: true,
        estaActivo: true,
        emailVerificado: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
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

    let isValid = false;

    // Si tiene 2FA habilitado (Google Authenticator)
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      // Verificar el código TOTP
      isValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret,
      });
    }
    // Si no tiene 2FA habilitado, validar OTP por email
    else if (!user.twoFactorEnabled) {
      // Buscar el OTP guardado
      const otpConfig = await this.prismaService.configuracionSistema.findUnique({
        where: { clave: `otp_email_${user.id}` },
      });

      if (!otpConfig) {
        return dataResponseError('Código OTP no encontrado o expirado');
      }

      try {
        const otpData = JSON.parse(otpConfig.valor);
        const expiresAt = new Date(otpData.expiresAt);

        // Verificar si el código expiró
        if (new Date() > expiresAt) {
          // Eliminar OTP expirado
          await this.prismaService.configuracionSistema.delete({
            where: { id: otpConfig.id },
          });
          return dataResponseError('El código OTP ha expirado. Solicita uno nuevo.');
        }

        // Verificar que el código coincida
        isValid = otpData.code === code;

        // Si es válido, eliminar el OTP usado
        if (isValid) {
          await this.prismaService.configuracionSistema.delete({
            where: { id: otpConfig.id },
          });
        }
      } catch (error) {
        return dataResponseError('Error al validar el código OTP');
      }
    } else {
      return dataResponseError('Método de verificación no válido');
    }

    if (!isValid) {
      return dataResponseError('Código de verificación inválido');
    }

    const tokens = await this.tokenService.generateTokens(user);

    // Construir perfil de usuario
    const userProfile: UserProfile = {
      usuarioId: user.id,
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      estaActivo: user.estaActivo,
      emailVerificado: user.emailVerificado,
      telefono: user.telefono || null,
      direccion: user.direccion || null,
      avatar: user.avatar || null,
      twoFactorEnabled: user.twoFactorEnabled,
    };

    // Extraer permisos únicos
    const permissions = new Set<string>();
    user.roles.forEach((userRole) => {
      userRole.rol.rolPermisos.forEach((rolPermiso) => {
        permissions.add(rolPermiso.permiso.nombre);
      });
    });

    // Construir respuesta de autenticación
    const response: AuthResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userProfile,
      permissions: Array.from(permissions),
      roles: user.roles.map((userRole) => userRole.rol.nombre),
    };

    return dataResponseSuccess<AuthResponse>({ data: response });
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
    const isPasswordValid = await bcrypt.compare(inputDto.password, user.password);
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

  /**
   *  Valida un usuario de Google o lo registra si no existe
   * @param googleUser - Datos del usuario obtenidos de Google OAuth
   * @returns Usuario encontrado o creado, o null en caso de error
   */
  async validateGoogleUser(googleUser: GoogleUserData): Promise<UserModel | null> {
    try {
      // 1. Verificar si el usuario existe en la base de datos
      const user = await this.prismaService.usuario.findUnique({
        where: { email: googleUser.email },
      });

      if (user) return user;

      // 2. Si no existe, crear el usuario
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      return this.prismaService.usuario.create({
        data: {
          email: googleUser.email,
          nombre: googleUser.firstName || 'Usuario',
          apellidos: googleUser.lastName || 'Google',
          password: hashedPassword,
          emailVerificado: true,
          avatar: googleUser.avatarUrl || null,
          estaActivo: false,
        },
      });
    } catch (error) {
      Logger.error('Error en validateGoogleUser:', error);
      return null;
    }
  }

  /**
   * Callback de autenticación de Google
   * @param user - Usuario autenticado por Google
   * @returns Respuesta con tokens de autenticación o error
   */
  async googleCallback(
    user: UserModel,
  ): Promise<ResponseDTO<{ accessToken: string; refreshToken: string }>> {
    try {
      if (!user.estaActivo) {
        return dataResponseError('Usuario inactivo');
      }

      // Obtener usuario completo con roles y permisos
      const fullUser = await this.prismaService.usuario.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellidos: true,
          estaActivo: true,
          emailVerificado: true,
          telefono: true,
          direccion: true,
          avatar: true,
          twoFactorEnabled: true,
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

      if (!fullUser) {
        return dataResponseError('Usuario no encontrado');
      }

      // Generar tokens
      const tokens = await this.tokenService.generateTokens(fullUser);

      // Construir perfil de usuario
      const userProfile: UserProfile = {
        usuarioId: fullUser.id,
        email: fullUser.email,
        nombre: fullUser.nombre,
        apellidos: fullUser.apellidos,
        estaActivo: fullUser.estaActivo,
        emailVerificado: fullUser.emailVerificado,
        telefono: fullUser.telefono || null,
        direccion: fullUser.direccion || null,
        avatar: fullUser.avatar || null,
        twoFactorEnabled: fullUser.twoFactorEnabled,
      };

      // Extraer permisos únicos
      const permissions = new Set<string>();
      fullUser.roles.forEach((userRole) => {
        userRole.rol.rolPermisos.forEach((rolPermiso) => {
          permissions.add(rolPermiso.permiso.nombre);
        });
      });

      // Construir respuesta completa de autenticación
      const response: AuthResponse = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: userProfile,
        permissions: Array.from(permissions),
        roles: fullUser.roles.map((userRole) => userRole.rol.nombre),
      };

      return dataResponseSuccess({ data: response as any });
    } catch (error) {
      Logger.error(error, 'Error al procesar autenticación de Google');
      return dataResponseError('Error al procesar autenticación de Google');
    }
  }

  /**
   * Reenviar código OTP por email
   */
  async resendOTP(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        emailVerificado: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    if (!user.emailVerificado) {
      return dataResponseError('Primero debes verificar tu email');
    }

    if (user.twoFactorEnabled) {
      return dataResponseError('Tienes 2FA habilitado, usa Google Authenticator');
    }

    // Generar nuevo código OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar OTP en configuración del sistema
    await this.prismaService.configuracionSistema.upsert({
      where: { clave: `otp_email_${user.id}` },
      update: {
        valor: JSON.stringify({ code: otpCode, expiresAt: expirationTime.toISOString() }),
        tipo: 'json',
        descripcion: 'OTP temporal para login por email',
      },
      create: {
        clave: `otp_email_${user.id}`,
        valor: JSON.stringify({ code: otpCode, expiresAt: expirationTime.toISOString() }),
        tipo: 'json',
        descripcion: 'OTP temporal para login por email',
      },
    });

    // Enviar OTP por email
    await this.emailService.sendOTPEmail(user.email, user.nombre, otpCode);

    return dataResponseSuccess(
      { data: 'Código OTP reenviado exitosamente' },
      { message: 'Se envió un nuevo código a tu correo electrónico' },
    );
  }
}
