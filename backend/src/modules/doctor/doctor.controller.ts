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
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
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

@ApiTags('Doctors')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Create doctor' })
  @ApiCreatedResponse({ description: 'Doctor created successfully' })
  @ApiConflictResponse({ description: 'Doctor with this CRM already exists' })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'List doctors' })
  @ApiOkResponse({ description: 'List returned successfully' })
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Doctor returned successfully' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update doctor' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Doctor updated successfully' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @ApiConflictResponse({ description: 'Doctor with this CRM already exists' })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete doctor' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Doctor removed successfully' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @ApiConflictResponse({
    description: 'Cannot delete doctor with linked appointments',
  })
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }
}
