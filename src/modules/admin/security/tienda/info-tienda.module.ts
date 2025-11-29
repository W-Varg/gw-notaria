import { Module } from '@nestjs/common';
import { InformacionTiendaController } from './info-tienda.controller';
import { InformacionTiendaService } from './info-tienda.service';
import { DatabaseModule } from '../../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InformacionTiendaController],
  providers: [InformacionTiendaService],
  exports: [InformacionTiendaService],
})
export class InformacionTiendaModule {}
