import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientPlanModule } from '../patient-plan/patient-plan.module';
import { Appointment } from '../appointment/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Appointment]),
    PatientPlanModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
