import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { configSwagger, IPackageJson, printServerInitLog } from './helpers/swagger.helper';
import { getCors } from './helpers/cors.helpers';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseFormatInterceptor } from './common/interceptors/response-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar hooks de apagado para limpiar recursos (como conexiones a BD)
  app.enableShutdownHooks();

  // Servir archivos estáticos usando useStaticAssets de NestJS
  // __dirname en producción apunta a dist/src, necesitamos subir 2 niveles
  app.useStaticAssets(join(__dirname, '..', '..', 'storage'), { prefix: '/storage' });
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), { prefix: '/uploads' });
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/' });

  app.enableVersioning({ type: VersioningType.URI });

  // load configuration from .env, packageJson
  const configService = app.get(ConfigService);
  const packageJson = configService.get<IPackageJson>('packageJson');

  // Configurar CORS
  app.enableCors({
    origin: getCors({
      env_mode: configService.get<string>('ENV_ENTORNO'),
      env_cors: configService.get<string>('ENV_CORS'),
    }),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(json({ limit: configService.get('appMaxSize') }));
  app.use(urlencoded({ limit: configService.get('appMaxSize'), extended: true }));

  // Interceptors globales
  app.useGlobalInterceptors(new ResponseFormatInterceptor(app.get(Reflector)));

  // Filters globales
  app.useGlobalFilters(new GlobalExceptionFilter());

  if (configService.get('showSwagger') === 'true')
    configSwagger(app, packageJson, { jsonDocumentUrl: '/api/swagger.yml' });

  const port = configService.get<number>('port') || 3000;
  await app.listen(port, '0.0.0.0').then(async () => {
    printServerInitLog(app, packageJson);
  });
}
bootstrap();
