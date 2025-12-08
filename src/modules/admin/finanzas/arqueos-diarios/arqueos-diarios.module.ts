import { Module } from '@nestjs/common';
import { ArqueosDiariosService } from './arqueos-diarios.service';
import { ArqueosDiariosController } from './arqueos-diarios.controller';

@Module({
  controllers: [ArqueosDiariosController],
  providers: [ArqueosDiariosService],
  exports: [ArqueosDiariosService],
})
export class ArqueosDiariosModule {}
