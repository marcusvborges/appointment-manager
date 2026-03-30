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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Patient Plans')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('patient-plans')
export class PatientPlanController {
  constructor(private readonly patientPlanService: PatientPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create patient plan' })
  @ApiCreatedResponse({ description: 'Patient plan created successfully' })
  @ApiConflictResponse({ description: 'Contract number already exists' })
  @ApiNotFoundResponse({ description: 'Patient or health plan not found' })
  @ApiConflictResponse({
    description: 'This health plan is already linked to the patient',
  })
  create(@Body() createPatientPlanDto: CreatePatientPlanDto) {
    return this.patientPlanService.create(createPatientPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'List patient plans' })
  @ApiOkResponse({ description: 'List returned successfully' })
  findAll() {
    return this.patientPlanService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Get patient plan by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNotFoundResponse({ description: 'Patient plan not found' })
  @ApiConflictResponse({ description: 'Contract number already exists' })
  @ApiConflictResponse({
    description: 'This health plan is already linked to the patient',
  })
  update(
    @Param('id') id: string,
    @Body() updatePatientPlanDto: UpdatePatientPlanDto,
  ) {
    return this.patientPlanService.update(id, updatePatientPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Update patient plan' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Patient plan removed successfully' })
  remove(@Param('id') id: string) {
    return this.patientPlanService.remove(id);
  }
}
