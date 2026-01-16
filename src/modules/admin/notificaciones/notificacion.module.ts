import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { PrismaService } from '../../../global/database/prisma.service';

@Module({
  controllers: [NotificacionController],
  providers: [NotificacionService, PrismaService],
  exports: [NotificacionService],
})
export class NotificacionModule {}
