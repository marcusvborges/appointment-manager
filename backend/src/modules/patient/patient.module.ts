import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientPlanModule } from '../patient-plan/patient-plan.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), PatientPlanModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
