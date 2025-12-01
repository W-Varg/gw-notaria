import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { ApiUnauthorizedError } from 'src/common/filters/global-exception.filter';

export interface IToken {
  usuarioId: string;
  nombreCompleto: string;
  estaActivo: boolean;
  // declaracion de variables para adjuntar la informacion de la sesion del token como ser el token() y client(informacion del cliente que consume(navegador) )
  token: string;
  expireIn: number;
  client?: string;
}

export interface TokenPayload {
  sub: {
    usuarioId: number;
    nombreCompleto: string;
    estaActivo: boolean;
  };
}

/**
 * Retrieves token information from the provided token.
 *
 * @param {any} token - the token to decode and retrieve information from
 * @return {IToken} the token information including user and application details
 */
export const getTokenInformacion = (token): { tokenInformacion: IToken; tokenV1: boolean } => {
  try {
    const decoded = decode(token);
    let tokenV1 = false;
    if (decoded == null) throw new ApiUnauthorizedError('Sesion inválida');
    const tokenInformacion: IToken = {
      usuarioId: null,
      nombreCompleto: null,
      estaActivo: null,
      token: token,
      expireIn: decoded['exp'],
    };

    if (decoded['sub']) {
      let item: any = decoded['sub'];
      if (Array.isArray(item)) {
        item = item.reverse().shift();
        tokenV1 = true;
      }

      tokenInformacion.usuarioId = item['usuarioId'];
      tokenInformacion.nombreCompleto = item['nombreCompleto'] ?? null;
      tokenInformacion.estaActivo = item['estaActivo'] ?? false;
    }
    return { tokenInformacion, tokenV1 };
  } catch (e) {
    throw e;
  }
};

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IToken => {
    const request = context.switchToHttp().getRequest();
    return request.userHeader ?? undefined;
  },
);
