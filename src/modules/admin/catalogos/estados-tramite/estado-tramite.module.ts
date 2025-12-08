import { Module } from '@nestjs/common';
import { EstadoTramiteService } from './estado-tramite.service';
import { EstadoTramiteController } from './estado-tramite.controller';

@Module({
  controllers: [EstadoTramiteController],
  providers: [EstadoTramiteService],
  exports: [EstadoTramiteService],
})
export class EstadoTramiteModule {}
