import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/global/database/prisma.service';
import { getTokenInformacion, IToken, TokenPayload } from '../decorators/token.decorator';

@Injectable()
export class TokenService {
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
   * Verifica un refresh token JWT y retorna el payload decodificado
   * @param refreshToken - Token de refresh a verificar
   * @returns Payload decodificado del token
   */
  verifyRefreshToken(refreshToken: string): any {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwtRefreshSecret'),
      });
      return payload;
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  }
  async generateTokens(user: {
    id: string;
    nombre: string;
    estaActivo: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      sub: {
        usuarioId: user.id,
        nombreCompleto: user.nombre, // Valor por defecto
        estaActivo: user.estaActivo,
      },
    };

    if (user.estaActivo) {
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('jwtSecret') || 'jwt-secret',
        expiresIn: this.configService.get('jwtExpiresIn') || '1h',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('jwtRefreshSecret') || 'refresh-secret',
        expiresIn: '7d',
      });
      return { accessToken, refreshToken };
    } else {
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('jwtSecret') || 'jwt-secret',
        expiresIn: '10s',
      });
      return { accessToken, refreshToken: '' };
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
}
