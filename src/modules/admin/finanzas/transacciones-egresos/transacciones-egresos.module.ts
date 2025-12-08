import { Module } from '@nestjs/common';
import { TransaccionesEgresosService } from './transacciones-egresos.service';
import { TransaccionesEgresosController } from './transacciones-egresos.controller';

@Module({
  controllers: [TransaccionesEgresosController],
  providers: [TransaccionesEgresosService],
  exports: [TransaccionesEgresosService],
})
export class TransaccionesEgresosModule {}
