import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { dataResponseError } from '../dtos/response.dto';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    const response: Response = context.switchToHttp().getResponse();

    // Si hay error de OAuth (fallo al obtener access token)
    if (err) {
      const frontendUrl = this.configService.get<string>('appFrontUrlBase');

      const errorMessage = err?.message?.includes('Failed to obtain access token')
        ? 'Fallo en obtener el access token de Google'
        : err?.message || 'Error de autenticación con Google';

      const errorResponse = dataResponseError<null>(errorMessage);
      const errorJsonString = JSON.stringify(errorResponse);

      response.redirect(
        `${frontendUrl}/auth/login?response=${encodeURIComponent(errorJsonString)}`,
      );

      return null;
    }

    return user;
  }
}
