import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupService } from './user-cleanup.service';
import { ScheduledTasksController } from './scheduled-tasks.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  controllers: [ScheduledTasksController],
  providers: [UserCleanupService],
  exports: [UserCleanupService],
})
export class ScheduledTasksModule {}
