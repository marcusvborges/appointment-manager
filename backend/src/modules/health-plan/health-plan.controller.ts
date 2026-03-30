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
import { HealthPlanService } from './health-plan.service';
import { CreateHealthPlanDto } from './dto/create-health-plan.dto';
import { UpdateHealthPlanDto } from './dto/update-health-plan.dto';
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

@ApiTags('Health Plans')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('health-plans')
export class HealthPlanController {
  constructor(private readonly healthPlanService: HealthPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create health plan' })
  @ApiCreatedResponse({ description: 'Health plan created successfully' })
  @ApiConflictResponse({
    description: 'Health plan with this name already exists',
  })
  create(@Body() createHealthPlanDto: CreateHealthPlanDto) {
    return this.healthPlanService.create(createHealthPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'List health plans' })
  @ApiOkResponse({ description: 'List returned successfully' })
  findAll() {
    return this.healthPlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get health plan by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Health plan returned successfully' })
  @ApiNotFoundResponse({ description: 'Health plan not found' })
  findOne(@Param('id') id: string) {
    return this.healthPlanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update health plan' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Health plan updated successfully' })
  @ApiNotFoundResponse({ description: 'Health plan not found' })
  @ApiConflictResponse({
    description: 'Health plan with this name already exists',
  })
  update(
    @Param('id') id: string,
    @Body() updateHealthPlanDto: UpdateHealthPlanDto,
  ) {
    return this.healthPlanService.update(id, updateHealthPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete health plan' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Health plan removed successfully' })
  @ApiNotFoundResponse({ description: 'Health plan not found' })
  @ApiConflictResponse({
    description: 'Cannot delete health plan with linked patient plans',
  })
  remove(@Param('id') id: string) {
    return this.healthPlanService.remove(id);
  }
}
