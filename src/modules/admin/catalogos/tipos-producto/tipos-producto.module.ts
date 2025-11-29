import { Module } from '@nestjs/common';
import { TiposProductoController } from './tipos-producto.controller';
import { TiposProductoService } from './tipos-producto.service';

@Module({
  controllers: [TiposProductoController],
  providers: [TiposProductoService],
})
export class TiposProductoModule {}
