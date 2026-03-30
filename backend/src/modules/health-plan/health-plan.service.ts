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
import { standardizeName } from 'src/common/utils/name.utils';

@Injectable()
export class HealthPlanService {
  constructor(
    @InjectRepository(HealthPlan)
    private readonly healthPlanRepository: Repository<HealthPlan>,
  ) {}

  async create(createHealthPlanDto: CreateHealthPlanDto): Promise<HealthPlan> {
    const normalizedName = standardizeName(createHealthPlanDto.name);

    await this.ensureNameIsAvailable(normalizedName);

    const healthPlan = this.healthPlanRepository.create({
      ...createHealthPlanDto,
      name: normalizedName,
    });

    return this.healthPlanRepository.save(healthPlan);
  }

  async findAll(): Promise<HealthPlan[]> {
    return this.healthPlanRepository.find();
  }

  async findOne(id: string): Promise<HealthPlan> {
    return this.findByIdOrFail(id);
  }

  async update(
    id: string,
    updateHealthPlanDto: UpdateHealthPlanDto,
  ): Promise<HealthPlan> {
    const healthPlan = await this.findByIdOrFail(id);

    if (updateHealthPlanDto.name !== undefined) {
      const normalizedName = standardizeName(updateHealthPlanDto.name);

      if (normalizedName !== healthPlan.name) {
        await this.ensureNameIsAvailable(normalizedName);
      }

      updateHealthPlanDto.name = normalizedName;
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

  private async ensureNameIsAvailable(name: string): Promise<void> {
    const existingHealthPlan = await this.healthPlanRepository.findOne({
      where: { name },
    });

    if (existingHealthPlan) {
      throw new ConflictException('Health plan with this name already exists');
    }
  }
}
