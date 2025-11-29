import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CategoriaModule } from './categorias/categoria.module';
import { TiposProductoModule } from './tipos-producto/tipos-producto.module';
import { ServiciosModule } from './servicios/servicios.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { HorariosModule } from './horarios/horarios.module';

const modules = [
  CategoriaModule,
  HorariosModule,
  ServiciosModule,
  TiposProductoModule,
  SucursalesModule,
];
@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => ({
        path: 'admin/catalogos',
        module,
      })),
    ),
  ],
})
export class CatalogosModule {}
