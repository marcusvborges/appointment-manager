import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHealthPlanDto } from './dto/create-health-plan.dto';
import { UpdateHealthPlanDto } from './dto/update-health-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthPlan } from './entities/health-plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HealthPlanService {
  constructor(
    @InjectRepository(HealthPlan)
    private readonly healthPlanRepository: Repository<HealthPlan>,
  ) {}

  async create(createHealthPlanDto: CreateHealthPlanDto): Promise<HealthPlan> {
    const existingHealthPlan = await this.healthPlanRepository.findOne({
      where: { name: createHealthPlanDto.name },
    });

    if (existingHealthPlan) {
      throw new ConflictException('Health plan with this name already exists');
    }

    const healthPlan = this.healthPlanRepository.create(createHealthPlanDto);

    return this.healthPlanRepository.save(healthPlan);
  }

  async findAll(): Promise<HealthPlan[]> {
    return this.healthPlanRepository.find();
  }

  async findOne(id: string): Promise<HealthPlan> {
    return this.findByIdOrFail(id.toString());
  }

  async update(
    id: string,
    updateHealthPlanDto: UpdateHealthPlanDto,
  ): Promise<HealthPlan> {
    const healthPlan = await this.findByIdOrFail(id.toString());

    if (
      updateHealthPlanDto.name !== undefined &&
      updateHealthPlanDto.name !== healthPlan.name
    ) {
      const existingHealthPlan = await this.healthPlanRepository.findOne({
        where: { name: updateHealthPlanDto.name },
      });

      if (existingHealthPlan) {
        throw new Error('Health plan with this name already exists');
      }
    }

    Object.assign(healthPlan, updateHealthPlanDto);
    return this.healthPlanRepository.save(healthPlan);
  }

  async remove(id: string) {
    await this.findByIdOrFail(id);
    await this.healthPlanRepository.delete(id);

    return { message: 'Health plan removed successfully' };
  }

  private async findByIdOrFail(id: string): Promise<HealthPlan> {
    const healthPlan = await this.healthPlanRepository.findOne({
      where: { id },
    });

    if (!healthPlan) {
      throw new NotFoundException('Health plan not found');
    }

    return healthPlan;
  }
}
