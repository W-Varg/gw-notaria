import { Injectable, CanActivate, ExecutionContext, SetMetadata, Inject } from '@nestjs/common';
import { TokenService } from './token-auth.service';
import { MsSeguridadHttpError } from '../filters/global-exception.filter';
import { Reflector } from '@nestjs/core';

const PERMISSIONS_KEY = 'permissions_headers_key';
export const RequiredPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector, // Añadir Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const requiredPermissions = this.getRequiredPermissions(context);

    const userPermissions = await this.tokenService.userListPermissions(request.userHeader);

    request.permissions = userPermissions;

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const result = this.hasPermission(userPermissions, requiredPermissions);

    // si result=false entonces genera un exception y no continua con la ejecucion del metodo
    if (!result) {
      const { method, url, query } = request;

      const response =
        process.env.ENV_DEBUG_SERVER === 'true' || process.env.ENV_DEBUG_FRONT === 'true'
          ? { ci: request?.userHeader?.ci, method, url, query }
          : null;

      throw new MsSeguridadHttpError('No tiene los permisos necesarios', 403, response, true);
    }

    return true;
  }

  // return array permission from headers
  private getRequiredPermissions(context: ExecutionContext): string[] {
    return Reflect.getMetadata(PERMISSIONS_KEY, context.getHandler());
  }

  // verify if have permissions
  private hasPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some((permission) => userPermissions.includes(permission));
  }
}
