import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TipoTramiteModule } from './tipos-tramite/tipo-tramite.module';
import { BancoModule } from './bancos/banco.module';
import { CuentaBancariaModule } from './cuentas-bancarias/cuenta-bancaria.module';
import { TipoDocumentoModule } from './tipos-documento/tipo-documento.module';
import { PlantillaDocumentoModule } from './plantillas-documento/plantilla-documento.module';
import { EstadoTramiteModule } from './estados-tramite/estado-tramite.module';
import { SucursalModule } from './sucursales/sucursal.module';
import { ComercializadoraModule } from './comercializadoras/comercializadora.module';

const modules = [
  SucursalModule,
  TipoTramiteModule,
  BancoModule,
  TipoDocumentoModule,
  EstadoTramiteModule,
  CuentaBancariaModule,
  PlantillaDocumentoModule,
  ComercializadoraModule,
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
