import { Module } from '@nestjs/common';
import { ComercializadoraService } from './comercializadora.service';
import { ComercializadoraController } from './comercializadora.controller';
import { PrismaService } from 'src/global/database/prisma.service';

@Module({
  controllers: [ComercializadoraController],
  providers: [ComercializadoraService, PrismaService],
  exports: [ComercializadoraService],
})
export class ComercializadoraModule {}
