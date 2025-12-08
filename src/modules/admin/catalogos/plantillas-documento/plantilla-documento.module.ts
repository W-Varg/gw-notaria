import { Module } from '@nestjs/common';
import { PlantillaDocumentoService } from './plantilla-documento.service';
import { PlantillaDocumentoController } from './plantilla-documento.controller';

@Module({
  controllers: [PlantillaDocumentoController],
  providers: [PlantillaDocumentoService],
  exports: [PlantillaDocumentoService],
})
export class PlantillaDocumentoModule {}
