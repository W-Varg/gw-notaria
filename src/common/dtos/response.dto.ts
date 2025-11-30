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

export interface IResponse {
  error: boolean;
  message: string;
  response: any;
  status: number;
}

interface IResponseDTOBody<T> {
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

type SuggestionsType<T> = {
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
