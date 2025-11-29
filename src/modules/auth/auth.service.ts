import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  RegistrarUserInput,
  LoginUserInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  RefreshTokenInput,
} from './dto/auth.input';
import { AuthResponse, UserProfile } from './auth.entity';
import { SecurityService } from './security.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly securityService: SecurityService,
  ) {}

  async registerUser(inputDto: RegistrarUserInput) {
    const { email, password, ...userData } = inputDto;

    // Verificar si el email ya existe
    const existingUser = await this.prismaService.usuario.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return dataResponseError('El email ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await this.prismaService.usuario.create({
      data: {
        ...userData,
        email,
        password: hashedPassword,
        emailVerificado: false,
      },
    });

    // Generar tokens usando SecurityService
    const tokens = await this.securityService.generateTokens(user.id);

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
      esEmpleado: false,
    };

    // Construir respuesta de autenticación
    const response: AuthResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userProfile,
      roles: [],
    };

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

    // Enviar email de verificación (simulado)
    this.sendVerificationEmail(user.email, verifyToken);

    return dataResponseSuccess<AuthResponse>({ data: response });
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
        empleado: { select: { id: true } },
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

    // Verificar que el usuario esté activo
    if (!user.estaActivo) {
      return dataResponseError('Usuario inactivo');
    }

    // Generar tokens usando SecurityService
    const tokens = await this.securityService.generateTokens(user.id);

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
      esEmpleado: !!user.empleado,
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
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

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
          empleado: { select: { id: true } },
        },
      });

      if (!user || !user.estaActivo) {
        return dataResponseError('Token inválido');
      }

      // Generar nuevos tokens usando SecurityService
      const tokens = await this.securityService.generateTokens(user.id);

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
        esEmpleado: !!user.empleado,
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

    // Enviar email de reset (simulado)
    this.sendResetPasswordEmail(user.email, resetToken);

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

    // Marcar el email como verificado
    await this.prismaService.usuario.update({
      where: { id: userId },
      data: { emailVerificado: true },
    });

    // Eliminar el token usado
    await this.prismaService.configuracionSistema.delete({
      where: { id: tokenConfig.id },
    });

    return dataResponseSuccess({ data: 'Email verificado exitosamente' });
  }

  async sendVerificationLink(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return dataResponseError('Usuario no encontrado');
    }

    if (user.emailVerificado) {
      return dataResponseError('El email ya está verificado');
    }

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

    // Enviar email de verificación
    this.sendVerificationEmail(user.email, verifyToken);

    return dataResponseSuccess({ data: 'Enlace de verificación enviado' });
  }

  async sendResetPasswordLink(email: string) {
    return this.forgotPassword({ email });
  }

  async sendForgotPasswordLink(email: string) {
    return this.forgotPassword({ email });
  }

  sendWelcomeEmail(_email: string, _name: string) {
    // Simulación de envío de email de bienvenida
    console.info(`Enviando email de bienvenida a ${_email} para ${_name}`);
    return dataResponseSuccess<string>({ data: 'Email de bienvenida enviado' });
  }

  sendVerificationEmail(_email: string, _token: string) {
    const urlFrontend = this.configService.get<string>('appFrontUrlBase');
    const verificationLink = `${urlFrontend}/verify-email?token=${_token}`;

    // Simulación de envío de email de verificación
    console.info(`\n${'='.repeat(80)}`);
    console.info(`📧 EMAIL DE VERIFICACIÓN`);
    console.info(`${'='.repeat(80)}`);
    console.info(`Para: ${_email}`);
    console.info(`\nEnlace de verificación:`);
    console.info(`${verificationLink}\n`);
    console.info(`⚠️  Abre este enlace en tu navegador para verificar tu email.`);
    console.info(`${'='.repeat(80)}\n`);

    return dataResponseSuccess<string>({ data: 'Email de verificación enviado' });
  }

  sendResetPasswordEmail(_email: string, _token: string) {
    const urlFrontend = this.configService.get<string>('appFrontUrlBase');
    const resetLink = `${urlFrontend}/auth/reset-password?token=${_token}`;

    // Simulación de envío de email de reset
    console.info(`\n${'='.repeat(80)}`);
    console.info(`🔐 EMAIL DE RECUPERACIÓN DE CONTRASEÑA`);
    console.info(`${'='.repeat(80)}`);
    console.info(`Para: ${_email}`);
    console.info(`Enlace para restablecer contraseña:`);
    console.info(`\n${resetLink}\n`);
    console.info(
      `⚠️  Este enlace debe abrirse en el navegador para establecer una nueva contraseña.`,
    );
    console.info(`${'='.repeat(80)}\n`);

    return dataResponseSuccess<string>({ data: 'Email de reset enviado' });
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    return this.sendResetPasswordEmail(email, token);
  }
}
