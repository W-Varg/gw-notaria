import {
  ExceptionFilter,
  Catch,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  HttpException,
  NotAcceptableException,
  UnauthorizedException,
  ForbiddenException,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { IResponseDTO, ResponseDTO } from 'src/common/dtos/response.dto';
import { printRequestUrl } from '../pipes/http-service.pipe';

const printRequestBodyLog = (host: ArgumentsHost, status: number, validations: any) => {
  const request = host.switchToHttp().getRequest();
  const url = request?.url;
  Logger.warn(`status ${status}, IP: ${request?.ip},URL: ${url}`);

  const data = request?.body; // Puedes ajustar esto según tus necesidades
  console.info(data, JSON.stringify(validations));
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ExecutionContextHost) {
    const response = host.switchToHttp().getResponse();
    console.error(error);

    let resp: IResponseDTO<any> = {
      error: true,
      message: 'Error interno del servidor',
      response: null,
      status: 500,
    };

    if (process.env.DEBUG_FRONT === 'true') {
      resp.response = {
        message: error?.message ?? '',
        name: error?.name ?? '',
        error,
        stack: error?.stack ?? '',
      };
    }

    if (error instanceof BadRequestException) {
      resp.message = `Excepción de solicitud incorrecta, ${
        (error.getResponse() as { message?: string }).message
      }`;
      resp.status = 400;
    } else if (error instanceof NotFoundException) {
      resp.message = 'No encontrado';
      resp.status = 404;
    } else if (error instanceof ForbiddenException) {
      resp.message = error.message ?? 'usuario no autorizado para acceder a esta información';
      resp.status = 403;
      printRequestUrl(host, 403);
      resp.response = null;
      error = null;
    } else if (error instanceof UnauthorizedException) {
      resp.message = error.message ?? 'usuario logueado información';
      resp.status = 401;
    } else if (error instanceof UnprocessableEntityException) {
      resp.message = 'Entidad no processable';
      resp.status = 422;
    } else if (error instanceof NotAcceptableError) {
      const respErr = error.getResponse() as IResponseDTO<any>;
      resp.message = respErr.message;
      resp.status = respErr.status;
    } else if (error instanceof ValidatorException) {
      resp = error.getResponse() as IResponseDTO<any>;
      printRequestBodyLog(host, resp.status, resp?.response);
      // printRequestUrl(host, resp.status);
    } else if (error.constructor.toString().includes('class HttpException extends Error')) {
      const respErr = (error as HttpException).getResponse() as IResponseDTO<any>;
      if (typeof respErr?.error !== 'boolean' && typeof respErr?.message !== 'string') {
        if (typeof respErr === 'string') resp.message = respErr;
      } else resp = respErr;
      if (!resp.status || resp.status < 200) resp.status = 400;
      if (error['status'] === 406) resp.status = 406;
    } else if (error instanceof MsSeguridadHttpError) {
      const respErr = error.getResponse() as IResponseDTO<any>;
      if (typeof respErr?.error !== 'boolean' && typeof respErr?.message !== 'string') {
        if (typeof respErr === 'string') response.message = respErr;
      } else resp = respErr;
      if (!resp.status || resp.status < 200) resp.status = 400;
      printRequestUrl(host, resp.status);
      resp.response = null;
      error = null;
    } else if (error instanceof Error) {
      // Captura del error de conversion de datos por grpc
      const grpcParsingError = error as any;

      if (
        grpcParsingError.code === 14 &&
        grpcParsingError.details.includes('No connection established')
      ) {
        resp.message = 'Error al conectarse al servicio de GRPC';
        resp.status = 422;
      } else if (
        grpcParsingError.code === 13 &&
        grpcParsingError.details.includes('Response message parsing error:')
      ) {
        resp.message = 'Error al convertir las respuestas de GRPC';
        resp.status = 422;
      }
      // Captura del error de servicio no implementado en server
      else if (
        grpcParsingError.code === 12 &&
        grpcParsingError.details.includes('[object Object]')
      ) {
        resp.message =
          'Error: el micro servicio de GRPC no tiene implementado este método o esta ignorado en MS-MYSQL.';
        resp.status = 422;
      }
    }

    if (
      process.env.ENV_DEBUG_SERVER === 'true' &&
      error?.message !== 'La sesión no se encuentra activa'
    ) {
      if (![404, 406].includes(resp.status)) {
        error ? console.error(error) : null;
      }
    }

    // TODO: Completar mas errores
    response.status(resp.status).json(resp);
  }
}

/* -------------------------------------------------------------------------- */
/*                         excepciones personalizadas                         */
/* -------------------------------------------------------------------------- */

/**
 * servicio para generar una exception http personalizada con un mensaje
 */
export class ValidatorException extends HttpException {
  constructor(message = 'error de validación', status = 406, response = null, error = true) {
    super({ error, message, status, response }, status);
  }
}

/**
 * servicio para generar una exception BadRequestException personalizada con un mensaje
 */
export class ApiBadRequestError extends BadRequestException {
  constructor(message = 'Ocurrió un error', status = 400, response = null, error = true) {
    super({ error, message, status, response });
  }
}

/**
 * servicio para generar una exception BadRequestException personalizada con un mensaje
 */
export class NotAcceptableError extends NotAcceptableException {
  constructor(
    message = 'no es posible devolver datos por un error',
    status = 406,
    response = null,
    error = true,
  ) {
    super({ error, message, status, response });
  }
}

/**
 * servicio para generar una exepcion personalizada con un mensaje, UnauthorizedException
 */
export class ApiUnauthorizedError extends UnauthorizedException {
  constructor(
    message = 'usuario no autenticado y/o token no válido',
    response = null,
    status = 401,
    error = true,
  ) {
    super({ error, message, status, response });
  }
}

export class MsSeguridadHttpError extends HttpException {
  constructor(message = 'Ocurrió un error', status = 400, response = null, error = true) {
    super({ error, message, status, response }, status);
  }
}

export const throwHttpExceptionFromResponseDTO = (resp: ResponseDTO<any>) => {
  if (resp.error) throw new HttpException(resp, resp.status);
};
