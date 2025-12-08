import { Module } from '@nestjs/common';
import { HistorialEstadosServicioService } from './historial-estados-servicio.service';
import { HistorialEstadosServicioController } from './historial-estados-servicio.controller';

@Module({
  controllers: [HistorialEstadosServicioController],
  providers: [HistorialEstadosServicioService],
  exports: [HistorialEstadosServicioService],
})
export class HistorialEstadosServicioModule {}
