import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { ApiUnauthorizedError } from '../../common/filters/global-exception.filter';
import { TokenService } from './token-auth.service';
import { IToken } from '../decorators/token.decorator';

/* ------------------------- opciones adicionales para validar el token ------------------------- */
const VALIDATE_TOKEN_VALUES = 'validate_token_extra_values';
export interface ValidateTokenOptions {
  validateToken?: boolean;
}

export const validateAppToken = (options: ValidateTokenOptions) => {
  const defaultValues = { validateToken: true, ...options };
  return SetMetadata(VALIDATE_TOKEN_VALUES, defaultValues);
};

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ApiUnauthorizedError('Solicitud realiza sin token');
    }

    const [bearer, token] = authHeader.split(' ');
    if (`${bearer}`.toLowerCase() !== 'bearer' || !token) {
      throw new ApiUnauthorizedError('la peticion debe contener un jwt de autorización válido');
    }

    // Verifica el token utilizando el MsSeguridadService
    const tokenDecoded: IToken = this.tokenService.decodeToken(token);

    if (!tokenDecoded) throw new ApiUnauthorizedError('Usuario no autenticado y/o token no válido');

    // Verifica el token utilizando el MsSeguridadService
    const { error } = await this.tokenService.validateToken(tokenDecoded, false);

    if (error)
      throw new ApiUnauthorizedError('Usuario no autenticado y/o token no válido de seguridad');

    request.userHeader = tokenDecoded; // Agrega los datos del usuario a la solicitud
    return true;
  }
}
