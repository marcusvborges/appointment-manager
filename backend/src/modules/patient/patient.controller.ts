import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create patient' })
  @ApiCreatedResponse({ description: 'Patient created successfully' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'List patients' })
  @ApiOkResponse({ description: 'List returned successfully' })
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNotFoundResponse({ description: 'Patient not found' })
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Get(':id/health-plans')
  @ApiOperation({ summary: 'List health plans for a patient' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findHealthPlans(@Param('id') id: string) {
    return this.patientService.findHealthPlans(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Get patient by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Patient updated successfully' })
  @ApiNotFoundResponse({ description: 'Patient not found' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete patient' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Patient removed successfully' })
  @ApiNotFoundResponse({ description: 'Patient not found' })
  @ApiConflictResponse({
    description: 'Cannot delete patient with linked appointments',
  })
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
}
