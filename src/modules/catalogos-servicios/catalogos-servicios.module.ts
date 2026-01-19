import { Module } from '@nestjs/common';
import { CatalogosServiciosService } from './catalogos-servicios.service';
import { CatalogosServiciosController } from './catalogos-servicios.controller';

@Module({
  controllers: [CatalogosServiciosController],
  providers: [CatalogosServiciosService],
})
export class CatalogosServiciosModule {}
