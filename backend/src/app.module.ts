import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PatientModule } from './modules/patient/patient.module';
import { HealthPlanModule } from './modules/health-plan/health-plan.module';
import { PatientPlanModule } from './modules/patient-plan/patient-plan.module';
import { ProcedureModule } from './modules/procedure/procedure.module';
import { AppointmentModule } from './modules/appointment/appointment.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    SpecialtyModule,
    DoctorModule,
    PatientModule,
    HealthPlanModule,
    PatientPlanModule,
    ProcedureModule,
    AppointmentModule,
  ],
})
export class AppModule {}
