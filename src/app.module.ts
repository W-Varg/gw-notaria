import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from './common/configurations/configuration';
import { APP_PIPE } from '@nestjs/core';
import { DtoValidatorPipe } from './common/pipes/dto-validator.pipe';
import { ParamValidatorPipe } from './common/pipes/param-validator.pipe';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuardsModule } from './common/guards/guards.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PublicModule } from './modules/public_portal/public.module';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { ScheduledTasksModule } from './modules/scheduled-tasks/scheduled-tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    GuardsModule, // Importar GuardsModule globalmente
    AdminModule,
    PublicModule,
    ScheduledTasksModule, // Módulo de tareas programadas
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    CacheInterceptor,
    { provide: APP_PIPE, useClass: DtoValidatorPipe },
    { provide: APP_PIPE, useClass: ParamValidatorPipe },
  ],
})
export class AppModule {}
