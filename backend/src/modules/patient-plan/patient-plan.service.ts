import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PatientPlan } from './entities/patient-plan.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientPlanDto } from './dto/create-patient-plan.dto';
import { HealthPlan } from '../health-plan/entities/health-plan.entity';
import { Patient } from '../patient/entities/patient.entity';
import { UpdatePatientPlanDto } from './dto/update-patient.dto';

@Injectable()
export class PatientPlanService {
  constructor(
    @InjectRepository(PatientPlan)
    private readonly patientPlanRepository: Repository<PatientPlan>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(HealthPlan)
    private readonly healthPlanRepository: Repository<HealthPlan>,
  ) {}

  async create(
    createPatientPlanDto: CreatePatientPlanDto,
  ): Promise<PatientPlan> {
    await this.checkPatientExists(createPatientPlanDto.patientId);
    await this.checkHealthPlanExists(createPatientPlanDto.healthPlanId);

    const existingContract = await this.patientPlanRepository.findOne({
      where: { contractNumber: createPatientPlanDto.contractNumber },
    });

    if (existingContract) {
      throw new ConflictException('Contract number already exists');
    }

    const existingAssociation = await this.patientPlanRepository.findOne({
      where: {
        patientId: createPatientPlanDto.patientId,
        healthPlanId: createPatientPlanDto.healthPlanId,
      },
    });

    if (existingAssociation) {
      throw new ConflictException(
        'This health plan is already linked to the patient',
      );
    }

    const patientPlan = this.patientPlanRepository.create(createPatientPlanDto);

    return this.patientPlanRepository.save(patientPlan);
  }

  async findAll(): Promise<PatientPlan[]> {
    return this.patientPlanRepository.find({
      relations: ['patient', 'healthPlan'],
    });
  }

  async findByPatient(patientId: string): Promise<PatientPlan[]> {
    await this.checkPatientExists(patientId);

    return this.patientPlanRepository.find({
      where: { patientId },
      relations: ['patient', 'healthPlan'],
    });
  }

  async update(id: string, updatePatientPlanDto: UpdatePatientPlanDto) {
    const patientPlan = await this.findByIdOrFail(id);

    if (
      updatePatientPlanDto.healthPlanId &&
      updatePatientPlanDto.healthPlanId !== patientPlan.healthPlanId
    ) {
      await this.checkHealthPlanExists(updatePatientPlanDto.healthPlanId);

      const existingAssociation = await this.patientPlanRepository.findOne({
        where: {
          patientId: patientPlan.patientId,
          healthPlanId: updatePatientPlanDto.healthPlanId,
          id: Not(patientPlan.id),
        },
      });

      if (existingAssociation) {
        throw new ConflictException(
          'This health plan is already linked to the patient',
        );
      }
    }

    if (
      updatePatientPlanDto.contractNumber &&
      updatePatientPlanDto.contractNumber !== patientPlan.contractNumber
    ) {
      const existingContract = await this.patientPlanRepository.findOne({
        where: {
          contractNumber: updatePatientPlanDto.contractNumber,
          id: Not(patientPlan.id),
        },
      });

      if (existingContract) {
        throw new ConflictException('Contract number already exists');
      }
    }

    Object.assign(patientPlan, updatePatientPlanDto);

    return this.patientPlanRepository.save(patientPlan);
  }

  async remove(id: string): Promise<{ message: string }> {
    const patientPlan = await this.findByIdOrFail(id);

    await this.patientPlanRepository.delete(patientPlan.id);

    return { message: 'Patient plan removed successfully' };
  }

  private async findByIdOrFail(id: string): Promise<PatientPlan> {
    const entity = await this.patientPlanRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Patient plan not found');
    }

    return entity;
  }

  private async checkPatientExists(patientId: string) {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
  }

  private async checkHealthPlanExists(healthPlanId: string) {
    const healthPlan = await this.healthPlanRepository.findOne({
      where: { id: healthPlanId },
    });

    if (!healthPlan) {
      throw new NotFoundException('Health plan not found');
    }
  }
}
