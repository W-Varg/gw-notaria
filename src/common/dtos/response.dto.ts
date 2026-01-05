import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class PaginationStructDTO {
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

type IResponse = {
  error: boolean;
  message: string;
  response: any;
  status: number;
};

interface IResponseDTOBody<T> {
  data?: T;
  pagination?: {
    total: number;
    page: number;
    size: number;
    from: number;
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
 * @returns Data default of Type
 */
export const dataResponseError = <T>(
  message = 'ocurrio un error',
  { error = true, status = 422, response = null } = {},
): ResponseDTO<T> => {
  return { error, message, response, status };
};

/* ---------------------------------------------------------------------------------------------- */
/**
 * @param validationErrors - Objeto con los campos y sus mensajes de error
 * @param message - Mensaje general del error (opcional)
 * @returns ResponseDTO con estructura de errores de validación
 *
 * @example
 * // Con mensaje personalizado
 * dataErrorValidations({
 *   nombre: ['La categoría ya existe'],
 *   descripcion: ['La descripción es requerida', 'Debe tener al menos 10 caracteres']},
 *   'Error en el registro del usuario'
 * );
 */
export const dataErrorValidations = <T = any>(
  validationErrors: Partial<ValidationErrorsType<T>>,
  message: string = 'hay un error de validación, por favor verifique los datos ingresados',
): ResponseDTO<T> => {
  return {
    error: true,
    message,
    response: {
      validationErrors: validationErrors as ValidationErrorsType<T>,
    },
    status: 406,
  };
};
