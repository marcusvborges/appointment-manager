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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
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

@ApiTags('Appointments')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create appointment' })
  @ApiCreatedResponse({ description: 'Appointment created successfully' })
  @ApiBadRequestResponse({
    description:
      'Invalid data, appointment in the past, invalid patient plan, or private appointment with patient plan',
  })
  @ApiNotFoundResponse({
    description:
      'Patient, doctor, patient plan, or one or more procedures not found',
  })
  @ApiConflictResponse({
    description: 'Doctor or patient already has an appointment at this time',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List appointments' })
  @ApiOkResponse({ description: 'List returned successfully' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Appointment returned successfully' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Appointment updated successfully' })
  @ApiBadRequestResponse({
    description:
      'Invalid data, appointment in the past, invalid patient plan, or private appointment with patient plan',
  })
  @ApiNotFoundResponse({
    description:
      'Appointment, patient, doctor, patient plan, or one or more procedures not found',
  })
  @ApiConflictResponse({
    description: 'Doctor or patient already has an appointment at this time',
  })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Appointment removed successfully' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
