import { Module } from '@nestjs/common';
import { MensajeContactoService } from './mensaje-contacto.service';
import { MensajeContactoController } from './mensaje-contacto.controller';

@Module({
  controllers: [MensajeContactoController],
  providers: [MensajeContactoService],
  exports: [MensajeContactoService],
})
export class MensajeContactoModule {}
