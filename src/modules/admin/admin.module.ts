import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { CatalogosModule } from './catalogos/catalogos.module';

@Module({
  imports: [CatalogosModule, SecurityModule],
})
export class AdminModule {}
