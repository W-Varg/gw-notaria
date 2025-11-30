import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import {
  ApiBadRequestError,
  ApiUnauthorizedError,
} from 'src/common/filters/global-exception.filter';

function isTokenExpire(exp) {
  const currentDate = new Date();
  const expiryDate = new Date(exp * 1000);
  return currentDate > expiryDate;
}

export interface IToken {
  usuarioId?: number;
  nombreCompleto: string;
  estaActivo?: boolean;
  // declaracion de variables para adjuntar la informacion de la sesion del token como ser el token() y client(informacion del cliente que consume(navegador) )
  expireIn: number;
  token: string;
  client?: string;
}

export interface TokenPayload {
  sub: {
    usuarioId: number;
    nombreCompleto: string;
    estaActivo: boolean;
  };
}

function GetDataOfJWT(request: Request): IToken {
  try {
    const textError = 'Error token';
    // #region  verificando que exista un token en los header: Authorization
    if (!request.headers['authorization'])
      throw new ApiBadRequestError(
        'debe enviar su token en los headers Authorization: bearer {{token}}',
        401,
      );

    // #endregion
    const token = request.headers['authorization'];

    if (!token.includes('Bearer '))
      throw new ApiBadRequestError(
        'debe enviar el token con el header `Authorization: bearer {{token}}`.',
        422,
      );

    const _token = token.split(' ')[1];
    let tokenInformacion: IToken = {
      nombreCompleto: null,
      token,
      expireIn: null,
      client: null,
    };
    try {
      const result = getTokenInformacion(_token);
      tokenInformacion = result.tokenInformacion;

      tokenInformacion.client = request.headers['user-agent'];
      if (isTokenExpire(tokenInformacion.expireIn))
        throw new ApiUnauthorizedError('el token expiró');
      if (tokenInformacion.estaActivo === false)
        throw new ApiUnauthorizedError('Usuario inactivo');
    } catch (e) {
      throw new ApiUnauthorizedError('el token no es valido/expiro', textError);
    }
    return tokenInformacion;
  } catch (e) {
    throw e;
  }
}

export const GetToken = createParamDecorator((_, ctx: ExecutionContext): IToken => {
  const request = ctx.switchToHttp().getRequest();
  const info = GetDataOfJWT(request);
  return info;
});

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

export const AuthUser = createParamDecorator((data: unknown, context: ExecutionContext): IToken => {
  const request = context.switchToHttp().getRequest();
  return request.userHeader ?? undefined;
});
