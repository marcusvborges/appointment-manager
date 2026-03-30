import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { PatientPlanService } from './patient-plan.service';
import { CreatePatientPlanDto } from './dto/create-patient-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePatientPlanDto } from './dto/update-patient.dto';

@UseGuards(JwtAuthGuard)
@Controller('patient-plans')
export class PatientPlanController {
  constructor(private readonly patientPlanService: PatientPlanService) {}

  @Post()
  create(@Body() createPatientPlanDto: CreatePatientPlanDto) {
    return this.patientPlanService.create(createPatientPlanDto);
  }

  @Get()
  findAll() {
    return this.patientPlanService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientPlanDto: UpdatePatientPlanDto,
  ) {
    return this.patientPlanService.update(id, updatePatientPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientPlanService.remove(id);
  }
}
