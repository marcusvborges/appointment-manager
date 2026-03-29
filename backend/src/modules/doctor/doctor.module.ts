import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtyModule } from '../specialty/specialty.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), SpecialtyModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
