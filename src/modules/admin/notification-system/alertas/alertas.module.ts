import { Module } from '@nestjs/common';
import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';
import { ExtraServicesModule } from '../services/extra-services.module';

@Module({
  imports: [ExtraServicesModule],
  controllers: [AlertasController],
  providers: [AlertasService],
})
export class AlertasModule {}
