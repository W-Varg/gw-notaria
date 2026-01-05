import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma.service';
import { dataResponseError, dataResponseSuccess, ResponseDTO } from 'src/common/dtos/response.dto';
import { randomBytes } from 'node:crypto';
import { compare, hash } from 'bcrypt';
import { authenticator } from 'otplib';
import { parseUserAgent } from 'src/helpers/user-agent.helper';
import dayjs from 'dayjs';
import {
  RegistrarUserInput,
  LoginUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  RefreshTokenInput,
  Verify2FAInput,
} from './dto/auth.input';
import { AuthResponse, AuthUsuario, GoogleUserData } from './auth.entity';
import { TokenService } from '../../common/guards/token-auth.service';
import { EmailService } from '../../global/emails/email.service';
import { Usuario as UserModel } from '../../generated/prisma/client';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';
import { TokenTemporalTipoEnum, TokenTemporalClaveEnum } from 'src/enums';
import { AuditService } from 'src/global/services/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Registra un intento de login en el historial
   */
  private async registrarHistorialLogin(
    usuarioId: string,
    exitoso: boolean,
    userAgent?: string,
    ipAddress?: string,
    motivoFallo?: string,
  ) {
    try {
      const parsedUA = parseUserAgent(userAgent);

      await this.prismaService.historialLogin.create({
        data: {
          usuarioId,
          exitoso,
          ipAddress: ipAddress || 'Unknown',
          userAgent: userAgent || 'Unknown',
          dispositivo: parsedUA.dispositivo,
          navegador: parsedUA.navegador,
          ubicacion: null, // Podría integrarse con un servicio de geolocalización
          motivoFallo: motivoFallo || null,
        },
      });
    } catch (error) {
      Logger.error('Error al registrar historial de login:', error);
    }
  }

  /**
   * Crea o actualiza una sesión activa para el usuario
   */
  private async crearSesion(
    usuarioId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    try {
      const parsedUA = parseUserAgent(userAgent);

      // Calcular fecha de expiración (30 días por defecto)
      const fechaExpiracion = dayjs().add(30, 'day').toDate();

      await this.prismaService.sesion.create({
        data: {
          usuarioId,
          refreshToken,
          userAgent: userAgent || 'Unknown',
          ipAddress: ipAddress || 'Unknown',
          dispositivo: parsedUA.dispositivo,
          navegador: parsedUA.navegador,
          ubicacion: null, // Podría integrarse con un servicio de geolocalización
          estaActiva: true,
          fechaExpiracion,
          ultimaActividad: dayjs().toDate(),
        },
      });
    } catch (error) {
      Logger.error('Error al crear sesión:', error);
    }
  }

  /**
   * Verifica si un dispositivo es de confianza y está activo
   */
  private async verificarDispositivoConfianza(
    usuarioId: string,
    deviceFingerprint?: string,
  ): Promise<boolean> {
    if (!deviceFingerprint) {
      return false;
    }

    try {
      const dispositivo = await this.prismaService.dispositivoConfianza.findFirst({
        where: {
          usuarioId,
          deviceFingerprint,
          estaActivo: true,
          fechaExpiracion: {
            gt: dayjs().toDate(), // Mayor que la fecha actual (no expirado)
          },
        },
      });

      if (dispositivo) {
        // Actualizar último uso
        await this.prismaService.dispositivoConfianza.update({
          where: { id: dispositivo.id },
          data: { ultimoUso: dayjs().toDate() },
        });
        return true;
      }

      return false;
    } catch (error) {
      Logger.error('Error al verificar dispositivo de confianza:', error);
      return false;
    }
  }

  /**
   * Registra un nuevo dispositivo de confianza
   */
  private async registrarDispositivoConfianza(
    usuarioId: string,
    deviceFingerprint: string,
    userAgent?: string,
  ) {
    try {
      const parsedUA = parseUserAgent(userAgent);

      // Calcular fecha de expiración (30 días)
      const fechaExpiracion = dayjs().add(30, 'day').toDate();

      // Verificar si ya existe el dispositivo
      const existingDevice = await this.prismaService.dispositivoConfianza.findFirst({
        where: {
          usuarioId,
          deviceFingerprint,
        },
      });

      if (existingDevice) {
        // Actualizar dispositivo existente
        await this.prismaService.dispositivoConfianza.update({
          where: { id: existingDevice.id },
          data: {
            estaActivo: true,
            fechaExpiracion,
            ultimoUso: dayjs().toDate(),
            userAgent: userAgent || existingDevice.userAgent,
            navegador: parsedUA.navegador || existingDevice.navegador,
            sistemaOperativo: parsedUA.dispositivo || existingDevice.sistemaOperativo,
          },
        });
      } else {
        // Crear nuevo dispositivo
        await this.prismaService.dispositivoConfianza.create({
          data: {
            usuarioId,
            deviceFingerprint,
            deviceName: parsedUA.navegador || 'Dispositivo desconocido',
            userAgent: userAgent || 'Unknown',
            navegador: parsedUA.navegador,
            sistemaOperativo: parsedUA.dispositivo,
            fechaExpiracion,
          },
        });
      }
    } catch (error) {
      Logger.error('Error al registrar dispositivo de confianza:', error);
    }
  }

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
    const hashedPassword = await hash(password, 10);

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
    const verifyToken = randomBytes(32).toString('hex');
    const expirationTime = dayjs().add(24, 'hour').toDate(); // 24 horas

    // Guardar el token de verificación
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

    // Enviar email de verificación usando el EmailService
    await this.emailService.sendVerificationEmail(user.email, user.nombre, verifyToken);

    return dataResponseSuccess({ data: user }, { message: 'Usuario registrado exitosamente' });
  }

  async login(inputDto: LoginUserInput) {
    const { email, password, userAgent, ipAddress } = inputDto;

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
      // Registrar intento fallido en audit log
      await this.auditService.logLoginAttempt({
        email,
        exitoso: false,
        motivoFallo: 'Usuario no encontrado',
        ip: ipAddress,
        userAgent,
      });
      return dataResponseError('no existe el usuario');
    }

    // Verificar contraseña
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      // Registrar intento fallido
      await this.registrarHistorialLogin(
        user.id,
        false,
        userAgent,
        ipAddress,
        'Contraseña incorrecta',
      );

      // Registrar en audit log
      await this.auditService.logLoginAttempt({
        email: user.email,
        exitoso: false,
        motivoFallo: 'Contraseña incorrecta',
        ip: ipAddress,
        userAgent,
        intentosSospechoso: false,
      });

      return dataResponseError('Credenciales inválidas');
    }

    // Verificar que el email esté verificado
    if (!user.emailVerificado) {
      await this.registrarHistorialLogin(
        user.id,
        false,
        userAgent,
        ipAddress,
        'Email no verificado',
      );

      // Registrar en audit log
      await this.auditService.logLoginAttempt({
        email: user.email,
        exitoso: false,
        motivoFallo: 'Email no verificado',
        ip: ipAddress,
        userAgent,
        intentosSospechoso: false,
      });

      return dataResponseError(
        'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.',
      );
    }

    // Verificar que el usuario esté activo
    if (!user.estaActivo) {
      await this.registrarHistorialLogin(user.id, false, userAgent, ipAddress, 'Usuario inactivo');

      // Registrar en audit log
      await this.auditService.logLoginAttempt({
        email: user.email,
        exitoso: false,
        motivoFallo: 'Usuario inactivo',
        ip: ipAddress,
        userAgent,
        intentosSospechoso: false,
      });

      return dataResponseError('Tu cuenta se encuentra inactiva. Contacta al administrador.');
    }

    // Verificar si es un dispositivo de confianza
    const isDispositivoConfianza = await this.verificarDispositivoConfianza(
      user.id,
      inputDto.deviceFingerprint,
    );

    // Si es dispositivo de confianza, completar login sin OTP
    if (isDispositivoConfianza) {
      const tokens = await this.tokenService.generateTokens(user);

      // Registrar historial de login exitoso
      await this.registrarHistorialLogin(user.id, true, userAgent, ipAddress);

      // Registrar en audit log
      await this.auditService.logLoginAttempt({
        email: user.email,
        exitoso: true,
        ip: ipAddress,
        userAgent,
      });

      await this.auditService.logAudit({
        usuarioId: user.id,
        accion: TipoAccionEnum.LOGIN,
        modulo: 'auth',
        tabla: 'Usuario',
        registroId: user.id,
        descripcion: `Usuario ${user.email} inició sesión desde dispositivo de confianza`,
        usuarioIp: ipAddress,
        userAgent,
      });

      // Crear sesión activa
      await this.crearSesion(user.id, tokens.refreshToken, userAgent, ipAddress);

      // Construir perfil de usuario
      const userProfile: AuthUsuario = {
        id: user.id,
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

    // Si el usuario tiene 2FA habilitado (Google Authenticator)
    if (user.twoFactorEnabled) {
      const partialResponse: AuthResponse = {
        accessToken: '',
        refreshToken: '',
        user: {
          id: user.id,
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

      // Guardar OTP con expiración de 10 minutos
      const expirationTime = dayjs().add(10, 'minute').toDate(); // 10 minutos
      await this.prismaService.tokenTemporal.upsert({
        where: {
          usuarioId_tipo: {
            usuarioId: user.id,
            tipo: TokenTemporalTipoEnum.OTP_LOGIN,
          },
        },
        update: {
          clave: TokenTemporalClaveEnum.OTP_EMAIL,
          valor: otpCode,
          metadatos: { expiresAt: dayjs(expirationTime).toISOString() },
          fechaExpiracion: expirationTime,
        },
        create: {
          clave: TokenTemporalClaveEnum.OTP_EMAIL,
          valor: otpCode,
          tipo: TokenTemporalTipoEnum.OTP_LOGIN,
          usuarioId: user.id,
          metadatos: { expiresAt: dayjs(expirationTime).toISOString() },
          fechaExpiracion: expirationTime,
        },
      });

      // Enviar OTP por email
      await this.emailService.sendOTPEmail(user.email, user.nombre, otpCode);

      const partialResponse: AuthResponse = {
        accessToken: '',
        refreshToken: '',
        user: {
          id: user.id,
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

    // Registrar historial de login exitoso
    await this.registrarHistorialLogin(user.id, true, userAgent, ipAddress);

    // Crear sesión activa
    await this.crearSesion(user.id, tokens.refreshToken, userAgent, ipAddress);

    // Construir perfil de usuario
    const userProfile: AuthUsuario = {
      id: user.id,
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

  async logout(userId: string) {
    // Obtener información del usuario para el log
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nombre: true },
    });

    if (user) {
      // Registrar logout en audit log
      await this.auditService.logAudit({
        usuarioId: user.id,
        accion: TipoAccionEnum.LOGOUT,
        modulo: 'auth',
        tabla: 'Usuario',
        registroId: user.id,
        descripcion: `Usuario ${user.email} cerró sesión`,
      });
    }

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
      const userProfile: AuthUsuario = {
        id: user.id,
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
    const resetToken = randomBytes(32).toString('hex');
    const expirationTime = dayjs().add(1, 'hour').toDate(); // 1 hora

    // Guardar el token
    await this.prismaService.tokenTemporal.upsert({
      where: {
        usuarioId_tipo: {
          usuarioId: user.id,
          tipo: TokenTemporalTipoEnum.RESET_PASSWORD,
        },
      },
      update: {
        clave: TokenTemporalClaveEnum.RESET_TOKEN,
        valor: resetToken,
        fechaExpiracion: expirationTime,
      },
      create: {
        clave: TokenTemporalClaveEnum.RESET_TOKEN,
        valor: resetToken,
        tipo: TokenTemporalTipoEnum.RESET_PASSWORD,
        usuarioId: user.id,
        fechaExpiracion: expirationTime,
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

    // Buscar el token
    const tokenConfig = await this.prismaService.tokenTemporal.findFirst({
      where: {
        tipo: TokenTemporalTipoEnum.RESET_PASSWORD,
        valor: token,
        fechaExpiracion: { gte: dayjs().toDate() },
      },
    });

    if (!tokenConfig) {
      return dataResponseError('Token de reset inválido o expirado');
    }

    // Extraer el ID del usuario
    const userId = tokenConfig.usuarioId;

    // Encriptar la nueva contraseña
    const hashedNewPassword = await hash(newPassword, 10);

    // Actualizar la contraseña
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Eliminar el token usado
    await this.prismaService.tokenTemporal.delete({
      where: { id: tokenConfig.id },
    });

    return dataResponseSuccess({ data: 'Contraseña restablecida exitosamente' });
  }

  async verifyEmail(inputDto: VerifyEmailInput) {
    const { token } = inputDto;

    // Buscar el token
    const tokenConfig = await this.prismaService.tokenTemporal.findFirst({
      where: {
        tipo: TokenTemporalTipoEnum.VERIFICACION_EMAIL,
        valor: token,
        fechaExpiracion: { gte: dayjs().toDate() },
      },
    });

    if (!tokenConfig) {
      return dataResponseError('Token de verificación inválido o expirado');
    }

    // Extraer el ID del usuario
    const userId = tokenConfig.usuarioId;

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
    await this.prismaService.tokenTemporal.delete({
      where: { id: tokenConfig.id },
    });

    // Enviar email de bienvenida
    if (user) {
      await this.emailService.sendWelcomeEmail(user.email, user.nombre);
    }

    return dataResponseSuccess({ data: 'Email verificado exitosamente' });
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

  /**
   * Verifica el código 2FA durante el login
   */
  async verify2FA(inputDto: Verify2FAInput) {
    const { userId, code, userAgent, ipAddress } = inputDto;

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
      const otpConfig = await this.prismaService.tokenTemporal.findUnique({
        where: {
          usuarioId_tipo: {
            usuarioId: user.id,
            tipo: TokenTemporalTipoEnum.OTP_LOGIN,
          },
        },
      });

      if (!otpConfig) {
        return dataResponseError('Código OTP no encontrado o expirado');
      }

      // Verificar si el código expiró
      if (dayjs().isAfter(otpConfig.fechaExpiracion)) {
        // Eliminar OTP expirado
        await this.prismaService.tokenTemporal.delete({
          where: { id: otpConfig.id },
        });
        return dataResponseError('El código OTP ha expirado. Solicita uno nuevo.');
      }

      // Verificar que el código coincida
      isValid = otpConfig.valor === code;

      // Si es válido, eliminar el OTP usado
      if (isValid) {
        await this.prismaService.tokenTemporal.delete({
          where: { id: otpConfig.id },
        });
      }
    } else {
      return dataResponseError('Método de verificación no válido');
    }

    if (!isValid) {
      // Registrar intento fallido de 2FA
      await this.registrarHistorialLogin(
        user.id,
        false,
        userAgent,
        ipAddress,
        'Código 2FA inválido',
      );

      // Registrar en audit log
      await this.auditService.logLoginAttempt({
        email: user.email,
        exitoso: false,
        motivoFallo: 'Código 2FA inválido',
        ip: ipAddress,
        userAgent,
        intentosSospechoso: false,
      });

      return dataResponseError('Código de verificación inválido');
    }

    // Si el usuario solicitó confiar en este dispositivo, registrarlo
    if (inputDto.trustDevice && inputDto.deviceFingerprint) {
      await this.registrarDispositivoConfianza(user.id, inputDto.deviceFingerprint, userAgent);
    }

    const tokens = await this.tokenService.generateTokens(user);

    // Registrar historial de login exitoso
    await this.registrarHistorialLogin(user.id, true, userAgent, ipAddress);

    // Registrar en audit log - Login exitoso con 2FA
    await this.auditService.logLoginAttempt({
      email: user.email,
      exitoso: true,
      ip: ipAddress,
      userAgent,
    });

    await this.auditService.logAudit({
      usuarioId: user.id,
      accion: TipoAccionEnum.LOGIN,
      modulo: 'auth',
      tabla: 'Usuario',
      registroId: user.id,
      descripcion: `Usuario ${user.email} completó login con verificación 2FA`,
      usuarioIp: ipAddress,
      userAgent,
    });

    // Crear sesión activa
    await this.crearSesion(user.id, tokens.refreshToken, userAgent, ipAddress);

    // Construir perfil de usuario
    const userProfile: AuthUsuario = {
      id: user.id,
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
      const randomPassword = randomBytes(32).toString('hex');
      const hashedPassword = await hash(randomPassword, 10);

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
    userAgent?: string,
    ipAddress?: string,
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

      // Registrar historial de login exitoso (Google OAuth)
      await this.registrarHistorialLogin(
        fullUser.id,
        true,
        userAgent || 'Google OAuth',
        ipAddress || 'unknown',
      );

      // Crear sesión activa
      await this.crearSesion(
        fullUser.id,
        tokens.refreshToken,
        userAgent || 'Google OAuth',
        ipAddress || 'unknown',
      );

      return dataResponseSuccess({
        data: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
      });
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
    const expirationTime = dayjs().add(10, 'minute').toDate(); // 10 minutos

    // Guardar OTP
    await this.prismaService.tokenTemporal.upsert({
      where: {
        usuarioId_tipo: {
          usuarioId: user.id,
          tipo: TokenTemporalTipoEnum.OTP_LOGIN,
        },
      },
      update: {
        clave: TokenTemporalClaveEnum.OTP_EMAIL,
        valor: otpCode,
        metadatos: { expiresAt: dayjs(expirationTime).toISOString() },
        fechaExpiracion: expirationTime,
      },
      create: {
        clave: TokenTemporalClaveEnum.OTP_EMAIL,
        valor: otpCode,
        tipo: TokenTemporalTipoEnum.OTP_LOGIN,
        usuarioId: user.id,
        metadatos: { expiresAt: dayjs(expirationTime).toISOString() },
        fechaExpiracion: expirationTime,
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
