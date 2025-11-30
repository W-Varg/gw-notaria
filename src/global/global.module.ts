import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/global/database/database.module';
import { EmailModule } from './emails/email.module';
import { ScheduledTasksModule } from './scheduled/scheduled-tasks.module';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ScheduledTasksModule, // Módulo de tareas programadas
    EmailModule,
  ],
})
export class GlobalModule {}
