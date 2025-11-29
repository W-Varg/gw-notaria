import { Injectable, ExecutionContext, CallHandler, NestInterceptor, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.get<{ ttl: number; apply: boolean; keyPrefix?: string }>(
      'cache-options',
      context.getHandler(),
    );

    if (!options || !options.apply) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const queryParams = { ...request.query };

    // Verificar el parámetro 'desdeCache'
    const desdeCache = queryParams.desdeCache;
    delete queryParams.desdeCache; // Remover para no afectar la key del cache

    // Si desdeCache es 'false', no usar cache
    if (desdeCache === 'false') {
      return next.handle();
    }

    // Generar key del cache basada en clase, método y query params restantes
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const httpMethod = request.method.toUpperCase(); // GET, POST, PUT, PATCH, DELETE
    const keyPrefix = options.keyPrefix;

    // Base key: httpMethod:className:methodName
    let key = `${keyPrefix}:${httpMethod}:${className}:${methodName}`;

    // Si queryParams no está vacío, agregar al final
    const queryParamsStr = JSON.stringify(queryParams);
    if (queryParamsStr !== '{}') {
      key = `${key}:${queryParamsStr}`;
    }

    // Intentar obtener del cache
    const cachedValue = await this.cacheManager.get(key);
    if (cachedValue !== undefined) {
      return of(cachedValue);
    }

    // Si no está en cache, ejecutar el handler y cachear el resultado
    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheManager.set(key, data, options.ttl * 1000); // TTL en segundos
      }),
    );
  }
}
