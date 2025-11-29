import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthModule } from 'src/modules/auth/auth.module';
// import { S3Service } from './s3.service';

@Module({
  imports: [AuthModule],
  controllers: [UsuariosController],
  providers: [UsuariosService /* S3Service */],
  exports: [UsuariosService /* S3Service */],
})
export class UsuariosModule {}
