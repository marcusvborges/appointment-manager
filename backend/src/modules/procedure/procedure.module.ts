import { Module } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Procedure } from './entities/procedure.entity';
import { AppointmentProcedure } from '../appointment/entities/appointment-procedure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Procedure, AppointmentProcedure])],
  controllers: [ProcedureController],
  providers: [ProcedureService],
  exports: [ProcedureService],
})
export class ProcedureModule {}
