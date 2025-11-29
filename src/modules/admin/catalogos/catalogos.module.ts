import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CategoriaModule } from './categorias/categoria.module';
import { TiposProductoModule } from './tipos-producto/tipos-producto.module';

const modules = [CategoriaModule, TiposProductoModule];
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
