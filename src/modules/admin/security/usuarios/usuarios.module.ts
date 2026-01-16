import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { AuthModule } from '../../../auth/auth.module';
import { ProfileModule } from '../../../auth/profile/profile.module';

@Module({
  imports: [AuthModule, ProfileModule],
  controllers: [UsuariosController],
  providers: [UsuariosService /* S3Service */],
  exports: [UsuariosService /* S3Service */],
})
export class UsuariosModule {}
