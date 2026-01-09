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
import { Prisma } from '../../generated/prisma/client';

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
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.handlePrismaKnownRequestError(error, resp);
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      this.handlePrismaInitializationError(error, resp);
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      this.handlePrismaRustPanicError(error, resp);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      this.handlePrismaValidationError(error, resp);
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

  /* -------------------------------------------------------------------------- */
  /*                     Métodos privados para errores de Prisma                */
  /* -------------------------------------------------------------------------- */

  /**
   * Maneja errores conocidos de Prisma (PrismaClientKnownRequestError)
   */
  private handlePrismaKnownRequestError(
    error: Prisma.PrismaClientKnownRequestError,
    resp: IResponseDTO<any>,
  ): void {
    const prismaError = error;

    // Errores de conexión a la base de datos
    if (prismaError.code === 'EHOSTUNREACH') {
      resp.message = 'No se puede alcanzar el servidor de base de datos';
      resp.status = 503;
      Logger.error(`Database connection error: EHOSTUNREACH - ${prismaError.message}`);
    } else if (prismaError.code === 'ECONNREFUSED') {
      resp.message = 'Conexión a la base de datos rechazada';
      resp.status = 503;
      Logger.error(`Database connection error: ECONNREFUSED - ${prismaError.message}`);
    } else if (prismaError.code === 'ETIMEDOUT') {
      resp.message = 'Tiempo de espera agotado al conectar con la base de datos';
      resp.status = 503;
      Logger.error(`Database connection error: ETIMEDOUT - ${prismaError.message}`);
    } else if (prismaError.code === 'P1001') {
      resp.message = 'No se puede alcanzar el servidor de base de datos';
      resp.status = 503;
      Logger.error(`Prisma error P1001: Can't reach database server - ${prismaError.message}`);
    } else if (prismaError.code === 'P1002') {
      resp.message = 'Tiempo de espera agotado al conectar con la base de datos';
      resp.status = 503;
      Logger.error(`Prisma error P1002: Database timeout - ${prismaError.message}`);
    } else if (prismaError.code === 'P1008') {
      resp.message = 'Tiempo de espera agotado en la operación de base de datos';
      resp.status = 504;
      Logger.error(`Prisma error P1008: Operations timeout - ${prismaError.message}`);
    } else if (prismaError.code === 'P1017') {
      resp.message = 'El servidor de base de datos cerró la conexión';
      resp.status = 503;
      Logger.error(`Prisma error P1017: Server closed connection - ${prismaError.message}`);
    } else if (prismaError.code === 'P2002') {
      resp.message = 'Ya existe un registro con esos datos únicos';
      resp.status = 409;
    } else if (prismaError.code === 'P2025') {
      resp.message = 'Registro no encontrado';
      resp.status = 404;
    } else {
      resp.message = 'Error en la operación de base de datos';
      resp.status = 500;
      Logger.error(`Prisma error ${prismaError.code}: ${prismaError.message}`);
    }

    if (process.env.DEBUG_FRONT === 'true') {
      resp.response = {
        code: prismaError.code,
        meta: prismaError.meta,
      };
    }
  }

  /**
   * Maneja errores de inicialización del cliente de Prisma
   */
  private handlePrismaInitializationError(
    error: Prisma.PrismaClientInitializationError,
    resp: IResponseDTO<any>,
  ): void {
    resp.message = 'Error al inicializar la conexión con la base de datos';
    resp.status = 503;
    Logger.error(`Prisma initialization error: ${error.message}`);

    if (process.env.DEBUG_FRONT === 'true') {
      resp.response = {
        errorCode: error.errorCode,
      };
    }
  }

  /**
   * Maneja errores críticos del motor de Prisma (Rust panic)
   */
  private handlePrismaRustPanicError(
    error: Prisma.PrismaClientRustPanicError,
    resp: IResponseDTO<any>,
  ): void {
    resp.message = 'Error crítico en el motor de base de datos';
    resp.status = 500;
    Logger.error(`Prisma rust panic: ${error.message}`);
  }

  /**
   * Maneja errores de validación de Prisma
   */
  private handlePrismaValidationError(
    error: Prisma.PrismaClientValidationError,
    resp: IResponseDTO<any>,
  ): void {
    resp.message = 'Error de validación en la consulta de base de datos';
    resp.status = 400;
    Logger.warn(`Prisma validation error: ${error.message}`);
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
class NotAcceptableError extends NotAcceptableException {
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
