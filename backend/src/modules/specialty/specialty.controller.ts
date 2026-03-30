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
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
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

@ApiTags('Specialties')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  @ApiOperation({ summary: 'Create specialty' })
  @ApiCreatedResponse({ description: 'Specialty created successfully' })
  @ApiConflictResponse({
    description: 'Specialty with this name already exists',
  })
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Get()
  @ApiOperation({ summary: 'List specialties' })
  @ApiOkResponse({ description: 'List returned successfully' })
  findAll() {
    return this.specialtyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specialty by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNotFoundResponse({ description: 'Specialty not found' })
  findOne(@Param('id') id: string) {
    return this.specialtyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specialty' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Specialty updated successfully' })
  @ApiNotFoundResponse({ description: 'Specialty not found' })
  update(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ) {
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete specialty' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Specialty removed successfully' })
  @ApiNotFoundResponse({ description: 'Specialty not found' })
  @ApiConflictResponse({
    description: 'Cannot delete specialty with linked doctors',
  })
  remove(@Param('id') id: string) {
    return this.specialtyService.remove(id);
  }
}
