import { Module } from '@nestjs/common';
import { DerivacionController } from './derivacion.controller';
import { DerivacionService } from './derivacion.service';
import { GlobalModule } from '../../../../global/global.module';

@Module({
  controllers: [DerivacionController],
  providers: [DerivacionService],
  exports: [DerivacionService],
})
export class DerivacionModule {}
