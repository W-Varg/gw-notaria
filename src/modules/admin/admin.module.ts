import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { NotificacionModule } from './notificaciones/notificacion.module';

@Module({
  imports: [CatalogosModule, SecurityModule, NotificacionModule],
})
export class AdminModule {}
