import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { dataResponseError } from '../../common/dtos/response.dto';

/**
 * Servicio de validaciones comunes para usuarios
 * Centraliza lógica de validación que se usa en múltiples módulos
 */
@Injectable()
export class UserValidationService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Valida que un email sea único en el sistema
   * @param email - Email a validar
   * @param excludeUserId - ID de usuario a excluir de la validación (para updates)
   * @returns true si el email es único, false si ya existe
   */
  async isEmailUnique(email: string, excludeUserId?: string): Promise<boolean> {
    const whereCondition: any = { email };

    if (excludeUserId) {
      whereCondition.id = { not: excludeUserId };
    }

    const existingUser = await this.prismaService.usuario.findFirst({
      where: whereCondition,
      select: { id: true },
    });

    return !existingUser;
  }

  /**
   * Valida que todos los roles existan en el sistema
   * @param roleIds - Array de IDs de roles a validar
   * @returns true si todos los roles existen, false si alguno no existe
   */
  async doRolesExist(roleIds: number[]): Promise<boolean> {
    if (!roleIds || roleIds.length === 0) return true;

    const existingRoles = await this.prismaService.rol.findMany({
      where: { id: { in: roleIds } },
      select: { id: true },
    });

    return existingRoles.length === roleIds.length;
  }

  /**
   * Obtiene un usuario con todas sus relaciones
   * @param userId - ID del usuario
   * @returns Usuario con roles y permisos o null si no existe
   */
  async getUserWithRelations(userId: string) {
    return await this.prismaService.usuario.findUnique({
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
  }

  /**
   * Valida que un usuario exista y esté activo
   * @param userId - ID del usuario
   * @returns Usuario si existe y está activo, o error
   */
  async validateUserExistsAndActive(userId: string) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        estaActivo: true,
        emailVerificado: true,
      },
    });

    if (!user) {
      return { error: 'Usuario no encontrado', user: null };
    }

    if (!user.estaActivo) {
      return { error: 'Usuario inactivo', user: null };
    }

    return { error: null, user };
  }

  /**
   * Extrae permisos únicos de los roles de un usuario
   * @param userRoles - Roles del usuario con sus permisos
   * @returns Array de nombres de permisos únicos
   */
  extractUniquePermissions(
    userRoles: Array<{
      rol: {
        rolPermisos: Array<{
          permiso: { nombre: string };
        }>;
      };
    }>,
  ): string[] {
    const permissions = new Set<string>();

    userRoles.forEach((userRole) => {
      userRole.rol.rolPermisos.forEach((rolPermiso) => {
        permissions.add(rolPermiso.permiso.nombre);
      });
    });

    return Array.from(permissions);
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   * @param userId - ID del usuario
   * @param permissionName - Nombre del permiso a verificar
   * @returns true si el usuario tiene el permiso, false si no
   */
  async userHasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.getUserWithRelations(userId);

    if (!user) return false;

    const permissions = this.extractUniquePermissions(user.roles);
    return permissions.includes(permissionName);
  }

  /**
   * Verifica si un usuario tiene alguno de los permisos especificados
   * @param userId - ID del usuario
   * @param permissionNames - Array de nombres de permisos
   * @returns true si el usuario tiene al menos uno de los permisos
   */
  async userHasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
    const user = await this.getUserWithRelations(userId);

    if (!user) return false;

    const permissions = this.extractUniquePermissions(user.roles);
    return permissionNames.some((permission) => permissions.includes(permission));
  }
}
