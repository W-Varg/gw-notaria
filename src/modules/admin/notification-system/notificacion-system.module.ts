import { Global, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ExtraServicesModule } from './services/extra-services.module';
import { AlertasModule } from './alertas/alertas.module';
import { ContactoModule } from './contacto/contacto.module';

const modules = [AlertasModule, ExtraServicesModule];
@Global()
@Module({
  imports: [
    RouterModule.register(
      modules.map((module) => ({
        path: 'events',
        module,
      })),
    ),
    AlertasModule,
    ExtraServicesModule,
    ContactoModule,
  ],
  providers: [],
  exports: [],
})
export class NotificationSystemModule {}
