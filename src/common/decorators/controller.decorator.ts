import {
  SetMetadata,
  Type,
  UseGuards,
  UseInterceptors,
  Version,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { TokenAuthGuard } from '../guards/token-auth.guard';
type ApiOperationOptions = Omit<Partial<OperationObject>, 'description' | 'summary'>;

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                 helpers decorators                                                 */
/* ------------------------------------------------------------------------------------------------------------------ */

const genCustomApiOperationContent = (
  summary: string,
  permissions: string[] = [],
  options: ApiOperationOptions,
) => ({
  summary,
  description:
    permissions.length > 0
      ? `permisos requeridos: 
<ul>
${permissions.map((p) => `<li><b>${p}</b></li>`)}
</ul>`
      : '',
  ...options,
});

export const VersionDescription = (
  version: string | number | null,
  summary: string,
  permissions?: string[],
  options?: ApiOperationOptions,
) => {
  if (version === null || version === undefined || version === '' || version === 0) {
    return applyDecorators(
      ApiOperation(genCustomApiOperationContent(summary, permissions, options)),
    );
  }
  return applyDecorators(
    Version(`${version}`),
    ApiOperation(genCustomApiOperationContent(summary, permissions, options)),
  );
};

export const ApiDescription = (
  summary: string,
  permissions?: string[],
  options?: ApiOperationOptions,
) => {
  return applyDecorators(ApiOperation(genCustomApiOperationContent(summary, permissions, options)));
};

export const ApiBodyDto = (dto: any) => {
  return applyDecorators(ApiBody({ type: dto }), ApiConsumes('application/json'));
};

/**
 * Decorator to generate Swagger responses for a controller method.
 * The decorator takes an object with the following properties:
 * - `success`: The type of the response for successful operations.
 * - `successStatus`: An array of status codes for the successful responses.
 * - `error`: The type of the response for errors.
 * - `errorStatus`: An array of status codes for the error responses.
 *
 * If `successStatus` is not provided, the decorator will generate responses for status codes 200 and 201.
 * If `errorStatus` is not provided, the decorator will generate responses for status codes 400, 401, 403, 404, 500, etc.
 *
 * The decorator returns an array of `ApiResponse` decorators that can be applied to a controller method.
 * @param options The options object.
 * @returns An array of ApiResponse decorators.
 */
export const DtoResponse = (options?: {
  success?: Type<unknown>;
  error?: Type<unknown>;
  successStatus?: number[];
  errorStatus?: number[];
}): MethodDecorator => {
  const decorators = [];
  if (options.successStatus?.length > 0)
    options.successStatus.forEach((status) => {
      decorators.push(ApiResponse({ type: options.success, status }));
    });
  else {
    if (options.success) {
      decorators.push(ApiResponse({ type: options.success, status: 200 }));
      // decorators.push(ApiResponse({ type: options.success, status: 201 }));
    }
  }

  // else
  if (options.errorStatus?.length > 0) {
    options.errorStatus.forEach((status) => {
      decorators.push(ApiResponse({ type: options.error, status }));
    });
  } else {
    if (options.error) {
      decorators.push(ApiResponse({ type: options.error }));
    }
  }
  return applyDecorators(...decorators);
};
