import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';
import { DerivacionModule } from './derivaciones/derivacion.module';

@Module({
  imports: [DerivacionModule],
  controllers: [ServicioController],
  providers: [ServicioService],
  exports: [ServicioService],
})
export class ServicioModule {}
