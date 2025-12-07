import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { NotificacionModule } from './notificaciones/notificacion.module';
import { FaqModule } from './faqs/faq.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [CatalogosModule, SecurityModule, NotificacionModule, FaqModule, LogsModule],
})
export class AdminModule {}
