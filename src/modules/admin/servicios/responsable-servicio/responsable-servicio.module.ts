import { Module } from '@nestjs/common';
import { ResponsableServicioService } from './responsable-servicio.service';
import { ResponsableServicioController } from './responsable-servicio.controller';

@Module({
  controllers: [ResponsableServicioController],
  providers: [ResponsableServicioService],
  exports: [ResponsableServicioService],
})
export class ResponsableServicioModule {}
