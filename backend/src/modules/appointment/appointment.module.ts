import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentProcedure } from './entities/appointment-procedure.entity';
import { Procedure } from '../procedure/entities/procedure.entity';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientPlanModule } from '../patient-plan/patient-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, AppointmentProcedure, Procedure]),
    PatientModule,
    DoctorModule,
    PatientPlanModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
