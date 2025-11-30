import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupService } from './user-cleanup.service';
import { ScheduledTasksController } from './scheduled-tasks.controller';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ScheduledTasksController],
  providers: [UserCleanupService],
  exports: [UserCleanupService],
})
export class ScheduledTasksModule {}
