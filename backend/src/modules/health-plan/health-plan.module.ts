import { Module } from '@nestjs/common';
import { HealthPlanService } from './health-plan.service';
import { HealthPlanController } from './health-plan.controller';
import { HealthPlan } from './entities/health-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HealthPlan])],
  controllers: [HealthPlanController],
  providers: [HealthPlanService],
})
export class HealthPlanModule {}
