import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { ReporteModule } from './report/reporte.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    CatalogosModule,
    SecurityModule,
    ReporteModule,
    DashboardModule,
  ],
})
export class AdminModule {}
