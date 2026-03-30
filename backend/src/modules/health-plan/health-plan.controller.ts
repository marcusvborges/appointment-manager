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

@UseGuards(JwtAuthGuard)
@Controller('health-plans')
export class HealthPlanController {
  constructor(private readonly healthPlanService: HealthPlanService) {}

  @Post()
  create(@Body() createHealthPlanDto: CreateHealthPlanDto) {
    return this.healthPlanService.create(createHealthPlanDto);
  }

  @Get()
  findAll() {
    return this.healthPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthPlanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHealthPlanDto: UpdateHealthPlanDto,
  ) {
    return this.healthPlanService.update(id, updateHealthPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthPlanService.remove(id);
  }
}
