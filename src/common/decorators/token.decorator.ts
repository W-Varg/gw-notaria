import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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
    usuarioId: string;
    nombreCompleto: string;
    estaActivo: boolean;
  };
}

export const AuthUser = createParamDecorator((data: unknown, context: ExecutionContext): IToken => {
  const request = context.switchToHttp().getRequest();
  return request.userHeader ?? undefined;
});
