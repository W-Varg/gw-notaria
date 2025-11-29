import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { InfoModule } from './info/info.module';
import { ContactoModule } from './contacto/contacto.module';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';

const modules = [InfoModule, ContactoModule];

@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => ({
        path: 'public',
        module,
      })),
    ),
  ],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}
