import { Module } from '@nestjs/common';
import { PatientPlanService } from './patient-plan.service';
import { PatientPlan } from './entities/patient-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Patient } from '../patient/entities/patient.entity';
import { HealthPlan } from '../health-plan/entities/health-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientPlan, Patient, HealthPlan])],
  providers: [PatientPlanService],
  exports: [PatientPlanService],
})
export class PatientPlanModule {}
