import { Module } from '@nestjs/common';
import { HealthPlanService } from './health-plan.service';
import { HealthPlanController } from './health-plan.controller';
import { HealthPlan } from './entities/health-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientPlan } from '../patient-plan/entities/patient-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthPlan, PatientPlan])],
  controllers: [HealthPlanController],
  providers: [HealthPlanService],
})
export class HealthPlanModule {}
