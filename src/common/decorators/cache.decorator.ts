import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

/**
 * Decorador para aplicar cache inteligente a métodos de controladores HTTP.
 *
 * Este decorador permite cachear automáticamente las respuestas de endpoints,
 * con control granular sobre cuándo usar o no el cache basado en parámetros
 * de consulta y configuración personalizable.
 *
 * @example
 * ```typescript
 * @UseCache({ ttl: 5 * 60, keyPrefix: 'productos' })
 * @Get('productos')
 * async getProductos() {
 *   return this.productosService.findAll();
 * }
 * ```
 *
 * @param options - Opciones de configuración del cache
 * @param options.ttl - Tiempo de vida del cache en segundos (por defecto: 60)
 * @param options.apply - Si aplicar o no el cache (por defecto: true)
 * @param options.keyPrefix - Prefijo para las keys del cache (por defecto: 'api-cache')
 *
 * @returns Decorador que aplica el interceptor de cache y documentación Swagger
 *
 * @since 1.0.0
 */
export function UseCache(options?: {
  /** Tiempo de vida del cache en segundos */
  ttl?: number;
  /** Si aplicar o no el cache */
  apply?: boolean;
  /** Prefijo para las keys del cache */
  keyPrefix?: string;
}) {
  return applyDecorators(
    SetMetadata('cache-options', { ttl: 60, apply: true, ...options }),
    UseInterceptors(CacheInterceptor),
    ApiQuery({
      name: 'desdeCache',
      required: false,
      type: Boolean,
      description:
        'Si es false, omite el cache y consulta directamente la base de datos. Por defecto usa cache.',
    }),
  );
}
