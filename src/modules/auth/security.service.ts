import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { IToken, getTokenInformacion } from 'src/common/decorators/token.decorator';

@Injectable()
export class SecurityService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Decodifica un token JWT y retorna la información del usuario
   * @param token - Token JWT a decodificar
   * @returns IToken - Información del token decodificado
   */
  decodeToken(token: string): IToken {
    try {
      const { tokenInformacion } = getTokenInformacion(token);
      return tokenInformacion;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Valida un token JWT y verifica que el usuario exista y esté activo
   * @param tokenDecoded - Token ya decodificado
   * @param validateUser - Si debe validar que el usuario exista en BD
   * @returns Promise<{error: string | null}> - Error si hay algún problema
   */
  async validateToken(
    tokenDecoded: IToken,
    validateUser: boolean = true,
  ): Promise<{ error: string | null }> {
    try {
      // Verificar que el token tenga la información básica
      if (!tokenDecoded.usuarioId) {
        return { error: 'Token inválido: falta usuarioId' };
      }

      // Si se requiere validar usuario en BD
      if (validateUser) {
        const user = await this.prismaService.usuario.findUnique({
          where: { id: tokenDecoded.usuarioId.toString() },
          select: { id: true, estaActivo: true, emailVerificado: true },
        });

        if (!user) {
          return { error: 'Usuario no encontrado' };
        }

        if (!user.estaActivo) {
          return { error: 'Usuario inactivo' };
        }
      }

      return { error: null };
    } catch (error) {
      return { error: 'Error al validar token' };
    }
  }

  /**
   * Obtiene la lista de permisos de un usuario basado en sus roles
   * @param tokenDecoded - Token decodificado del usuario
   * @returns Promise<string[]> - Array de permisos únicos
   */
  async userListPermissions(tokenDecoded: IToken): Promise<string[]> {
    try {
      if (!tokenDecoded.usuarioId) {
        return [];
      }

      const user = await this.prismaService.usuario.findUnique({
        where: { id: tokenDecoded.usuarioId.toString() },
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

      if (!user || !user.estaActivo) {
        return [];
      }

      // Extraer todos los permisos únicos
      const permissions = new Set<string>();
      user.roles.forEach((userRole) => {
        userRole.rol.rolPermisos.forEach((rolPermiso) => {
          permissions.add(rolPermiso.permiso.nombre);
        });
      });

      return Array.from(permissions);
    } catch (error) {
      console.error('Error al obtener permisos del usuario:', error);
      return [];
    }
  }

  /**
   * Obtiene la lista de roles de un usuario
   * @param tokenDecoded - Token decodificado del usuario
   * @returns Promise<string[]> - Array de roles únicos
   */
  async userListRoles(tokenDecoded: IToken): Promise<string[]> {
    try {
      if (!tokenDecoded.usuarioId) {
        return [];
      }

      const user = await this.prismaService.usuario.findUnique({
        where: { id: tokenDecoded.usuarioId.toString() },
        include: {
          roles: {
            include: {
              rol: true,
            },
          },
        },
      });

      if (!user || !user.estaActivo) {
        return [];
      }

      // Extraer todos los roles únicos
      const roles = user.roles.map((userRole) => userRole.rol.nombre);
      return roles;
    } catch (error) {
      console.error('Error al obtener roles del usuario:', error);
      return [];
    }
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   * @param tokenDecoded - Token decodificado del usuario
   * @param permission - Permiso a verificar
   * @returns Promise<boolean> - True si tiene el permiso
   */
  async userHasPermission(tokenDecoded: IToken, permission: string): Promise<boolean> {
    try {
      const permissions = await this.userListPermissions(tokenDecoded);
      return permissions.includes(permission);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si un usuario tiene un rol específico
   * @param tokenDecoded - Token decodificado del usuario
   * @param role - Rol a verificar
   * @returns Promise<boolean> - True si tiene el rol
   */
  async userHasRole(tokenDecoded: IToken, role: string): Promise<boolean> {
    try {
      const roles = await this.userListRoles(tokenDecoded);
      return roles.includes(role);
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene información completa del usuario desde el token
   * @param tokenDecoded - Token decodificado del usuario
   * @returns Promise<any> - Información completa del usuario
   */
  async getUserInfo(tokenDecoded: IToken) {
    try {
      if (!tokenDecoded.usuarioId) {
        return null;
      }

      const user = await this.prismaService.usuario.findUnique({
        where: { id: tokenDecoded.usuarioId.toString() },
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
        return null;
      }

      // Remover contraseña de la respuesta
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      return null;
    }
  }

  /**
   * Genera un nuevo token JWT para un usuario
   * @param userId - ID del usuario
   * @returns Promise<{accessToken: string, refreshToken: string}>
   */
  async generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: {
        usuarioId: userId,
        aplicacionId: 1, // Valor por defecto
        funcionarioId: 1, // Valor por defecto
        msPersonaId: 1, // Valor por defecto
        institucionId: 1, // Valor por defecto
        perfilPersonaId: 1, // Valor por defecto
        oficinaId: 1, // Valor por defecto
        municipioId: 1, // Valor por defecto
        departamentoId: 1, // Valor por defecto
        ci: userId, // Usar userId como CI temporal
        nombreCompleto: 'Usuario', // Valor por defecto
        aplicacionTag: 'pets-app', // Tag de la aplicación
      },
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET') || 'jwt-secret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verifica si un token JWT es válido
   * @param token - Token JWT a verificar
   * @returns Promise<boolean> - True si el token es válido
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET') || 'jwt-secret',
      });
      return !!decoded;
    } catch (error) {
      return false;
    }
  }
}
