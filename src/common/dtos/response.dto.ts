import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { isNumber } from 'class-validator';

export class PaginationStructDTO {
  // @ApiProperty({ description: 'Total de registros' })
  // from?: number;

  @ApiProperty({ description: 'Total de registros' })
  @Expose()
  total?: number;

  @ApiProperty({ description: 'Pagina actual' })
  @Expose()
  page?: number; // skip

  @ApiProperty({ description: 'Limite de registros' })
  @Expose()
  size?: number; // take

  @ApiProperty({ description: 'Registro desde' })
  @Expose()
  from?: number; // (page -1) * size
}

export class ResponseStructDTO {
  @ApiProperty({ type: PaginationStructDTO, required: false, nullable: true })
  @Expose()
  pagination: PaginationStructDTO;

  @ApiProperty({
    type: Object,
    required: false,
    nullable: true,
    example: { field: ['error validation 1', 'error validation 2'] },
  })
  @Expose()
  validationErrors?: ValidationErrorsType<any>;
}

export class ApiOkResponseDto {
  @ApiProperty({ description: 'Si la respuesta es de error' })
  @Expose()
  error: boolean;

  @ApiProperty({ description: 'Menasje de la respuesta' })
  @Expose()
  message: string;

  @ApiProperty({
    type: ResponseStructDTO,
    description: 'Estructura de respuesta',
  })
  @Expose()
  response: any;

  @ApiProperty({ description: 'Codigo de estado de la respuesta' })
  @Expose()
  status: number;

  @ApiProperty({ description: 'Si la respuesta es de cache', nullable: true })
  @Expose()
  cache?: boolean;
}

export class ApiResponseError {
  @ApiProperty({ description: 'Si la respuesta es de error' })
  @Expose()
  error: boolean;

  @ApiProperty({ description: 'Menasje de la respuesta' })
  @Expose()
  message: string;

  @ApiProperty({
    type: PickType(ResponseStructDTO, ['validationErrors']),
    description: 'Estructura de respuesta',
  })
  @Expose()
  response: any;

  @ApiProperty({ description: 'Codigo de estado de la respuesta' })
  @Expose()
  status: number;

  @ApiProperty({ description: 'Si la respuesta es de cache', nullable: true })
  @Expose()
  cache?: boolean;
}

export interface IResponse {
  error: boolean;
  message: string;
  response: any;
  status: number;
}

export interface IResponseDTOBody<T> {
  data?: T;
  pagination?: {
    total: number;
    page: number;
    size: number;
    from?: number; // FIXME: se debe obligar a que venga este campo si es paginacion, no es opcional
  };
  validationErrors?: ValidationErrorsType<T>;
  suggestions?: SuggestionsType<T>;
}

/**
 * Tipo de respuesta para todas las peticiones
 * @response response: T
 */
export type IResponseDTO<T> = {
  error: boolean;
  message: string;
  response: T;
  status: number;
};

/**
 * Dto para tipo de respuesta con tipo
 */
export type ResponseDTO<T> = {
  error: boolean;

  message: string;

  response: IResponseDTOBody<T>;

  status: number;

  cache?: boolean;
};

/* ---------------------------------------------------------------------------------------------- */
export type ValidationErrorsType<T> = {
  [key in keyof T]: Array<string>;
};

export type SuggestionsType<T> = {
  [key in keyof T]: Array<string>;
};

/**
 * @param response,
 * @param param1, optional data, this methos have values default
 * @returns Data default of Type IResponse
 */
export const dataResponseFormat = (
  response,
  { error = false, message = 'operacion Exitosa', status = 201 } = {},
): IResponse => {
  return { error, message, response, status };
};

/**
 * @param response,
 * @param param1, optional data, this methos have values default
 * @returns Data default of Type IResponse
 */
export const dataResponseSuccess = <T>(
  response: IResponseDTOBody<T>,
  { error = false, message = 'operacion Exitosa', status = 200 }: Partial<ResponseDTO<T>> = {},
): ResponseDTO<T> => {
  return { error, message, response, status };
};

/* ---------------------------------------------------------------------------------------------- */
/**
 * @param response,
 * @param param1, optional data, this methos have values default
 * @returns Data default of Type IResponse
 */
export const dataResponseError = <T>(
  message = 'ocurrio un error',
  { error = true, status = 422, response = null } = {},
): ResponseDTO<T> => {
  return { error, message, response, status };
};

/**
 * @param response,
 * @param param1, optional data, this methos have values default
 * @returns Data default of Type IResponse
 */
export const MsMysqlResponseFormat = <T>(
  response = null,
  {
    message: successMessage = 'Operación Exitosa',
    status: successStatus = 200,
  }: Partial<ResponseDTO<T>> = {},
  {
    error: errorError = true,
    message: errorMessage = 'Error desconocido',
    status: errorStatus = 500,
  }: Partial<ResponseDTO<T>> = {},
): ResponseDTO<T> => {
  if (!response?.errorMessage) {
    if (response?.data !== undefined && response?.data !== null) {
      return {
        error: false,
        message: successMessage,
        response: {
          data: response?.data,
          suggestions: response?.suggestions,
          validationErrors: response?.validationErrors,
          pagination:
            response?.pagination ||
            (isNumber(response?.total) ? { total: response?.total } : undefined),
        },
        status: successStatus,
      } as ResponseDTO<T>;
    } else {
      return {
        error: errorError,
        message: errorMessage,
        response: {},
        status: errorStatus,
      } as ResponseDTO<T>;
    }
  } else {
    const errorFormat: ResponseDTO<T> = {
      error: errorError,
      message: 'Ocurrió un error de base de datos y el sistema',
      response: {
        validationErrors: response?.validationErrors
          ? JSON.parse(response?.validationErrors)
          : undefined,
      },
      status: errorStatus,
    };

    if (process.env.ENV_DEBUG_SERVER === 'true' || process.env.ENV_DEBUG_FRONT === 'true') {
      errorFormat.message = 'Ocurrió un error de base de datos y el sistema';
      errorFormat.response = {
        validationErrors: response?.validationErrors
          ? JSON.parse(response?.validationErrors)
          : undefined,
      };
    }
    return errorFormat;
  }
};

/**
 * @param response,
 * @param param1, optional data, this methos have values default
 * @returns Data default of Type IResponse
 */
export const msConnectionRegected = (
  dataError,
  { error = true, message = 'Ocurrio un error', status = 406 } = {},
): IResponse => {
  if (dataError.code === 'ECONNREFUSED')
    return {
      error: true,
      message: 'Conección no establecido',
      response: `${dataError.code}, address: ${dataError.address}, port: ${dataError.port}`,
      status: 503,
    };
  // message = dataError.message ? dataError.message : message;
  return { error, message, response: dataError, status };
};
