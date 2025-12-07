import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { NotificacionModule } from './notificaciones/notificacion.module';
import { FaqModule } from './faqs/faq.module';

@Module({
  imports: [CatalogosModule, SecurityModule, NotificacionModule, FaqModule],
})
export class AdminModule {}
