import { Module } from '@nestjs/common';
import { PatientPlanService } from './patient-plan.service';
import { PatientPlan } from './entities/patient-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Patient } from '../patient/entities/patient.entity';
import { HealthPlan } from '../health-plan/entities/health-plan.entity';
import { PatientPlanController } from './patient-plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PatientPlan, Patient, HealthPlan])],
  controllers: [PatientPlanController],
  providers: [PatientPlanService],
  exports: [PatientPlanService],
})
export class PatientPlanModule {}
