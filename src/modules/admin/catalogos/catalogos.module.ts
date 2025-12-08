import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CategoriaModule } from './categorias/categoria.module';
import { BancoModule } from './bancos/banco.module';
import { CuentaBancariaModule } from './cuentas-bancarias/cuenta-bancaria.module';
import { TipoDocumentoModule } from './tipos-documento/tipo-documento.module';
import { PlantillaDocumentoModule } from './plantillas-documento/plantilla-documento.module';
import { EstadoTramiteModule } from './estados-tramite/estado-tramite.module';

const modules = [
  CategoriaModule,
  BancoModule,
  TipoDocumentoModule,
  EstadoTramiteModule,
  CuentaBancariaModule,
  PlantillaDocumentoModule,
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
