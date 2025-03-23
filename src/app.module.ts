
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './services/prisma.service';
import { FetchInventoryService } from './services/fetch-inventory.service';
import { SchedulerService } from './tasks/scheduler.service';
import { ExperienceController } from './controllers/experience.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ExperienceController],
  providers: [PrismaService, FetchInventoryService, SchedulerService],
})
export class AppModule {}
