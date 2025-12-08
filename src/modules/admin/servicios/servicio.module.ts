import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';

@Module({
  controllers: [ServicioController],
  providers: [ServicioService],
  exports: [ServicioService],
})
export class ServicioModule {}
