import { Module } from '@nestjs/common';
import { VentasServiciosService } from './ventas-servicios.service';
import { VentasServiciosController } from './ventas-servicios.controller';

@Module({
  controllers: [VentasServiciosController],
  providers: [VentasServiciosService],
})
export class VentasServiciosModule {}
