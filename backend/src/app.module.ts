import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { DoctorModule } from './modules/doctor/doctor.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    SpecialtyModule,
    DoctorModule,
  ],
})
export class AppModule {}
