import { Module } from '@nestjs/common';
import { PagosIngresosService } from './pagos-ingresos.service';
import { PagosIngresosController } from './pagos-ingresos.controller';

@Module({
  controllers: [PagosIngresosController],
  providers: [PagosIngresosService],
  exports: [PagosIngresosService],
})
export class PagosIngresosModule {}
