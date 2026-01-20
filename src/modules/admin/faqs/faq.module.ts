import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { PrismaService } from '../../../global/database/prisma.service';

@Module({
  controllers: [FaqController],
  providers: [FaqService, PrismaService],
  exports: [FaqService],
})
export class FaqModule {}
