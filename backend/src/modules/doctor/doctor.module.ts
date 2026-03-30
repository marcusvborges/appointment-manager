import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from '../specialty/entities/specialty.entity';
import { Appointment } from '../appointment/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Specialty, Appointment])],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
