import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ArqueosDiariosModule } from './arqueos-diarios/arqueos-diarios.module';
import { GastosModule } from './gastos/gastos.module';
import { PagosIngresosModule } from './pagos-ingresos/pagos-ingresos.module';
import { TransaccionesEgresosModule } from './transacciones-egresos/transacciones-egresos.module';
import { MovimientosModule } from './movimientos/movimientos.module';

const modules = [
  ArqueosDiariosModule,
  GastosModule,
  PagosIngresosModule,
  TransaccionesEgresosModule,
  MovimientosModule,
];
@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => ({
        path: 'admin/finanzas',
        module,
      })),
    ),
  ],
})
export class FinanzasModule {}
