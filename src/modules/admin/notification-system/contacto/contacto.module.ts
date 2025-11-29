import { Module } from '@nestjs/common';
import { ContactoController } from './contacto.controller';
import { ContactoService } from './contacto.service';
import { NotificationService } from 'src/modules/admin/notification-system/services/notification.service';

@Module({
  controllers: [ContactoController],
  providers: [ContactoService, NotificationService],
})
export class ContactoModule {}
