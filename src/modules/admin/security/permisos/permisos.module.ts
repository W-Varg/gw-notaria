import { Module } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { PermisosRepository } from './permisos.repository';

@Module({
  controllers: [PermisosController],
  providers: [PermisosService, PermisosRepository],
})
export class PermisosModule {}
