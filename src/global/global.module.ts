import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/global/database/database.module';
import { EmailModule } from './emails/email.module';
import { ScheduledTasksModule } from './scheduled/scheduled-tasks.module';
import { FileStorageService } from './services/file-storage.service';
import { QrCodeService } from './services/qr-code.service';
import { UserValidationService } from './services/user-validation.service';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ScheduledTasksModule, // Módulo de tareas programadas
    EmailModule,
  ],
  providers: [FileStorageService, QrCodeService, UserValidationService],
  exports: [FileStorageService, QrCodeService, UserValidationService],
})
export class GlobalModule {}
