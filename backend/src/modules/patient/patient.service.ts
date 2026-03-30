import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientPlanService } from '../patient-plan/patient-plan.service';
import { Appointment } from '../appointment/entities/appointment.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly patientPlanService: PatientPlanService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto);
    const savedPatient = await this.patientRepository.save(patient);

    if (createPatientDto.healthPlanId && createPatientDto.contractNumber) {
      await this.patientPlanService.create({
        patientId: savedPatient.id,
        healthPlanId: createPatientDto.healthPlanId,
        contractNumber: createPatientDto.contractNumber,
      });
    }

    return savedPatient;
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async findOne(id: string): Promise<Patient> {
    return this.findByIdOrFail(id);
  }

  async findHealthPlans(patientId: string) {
    await this.findByIdOrFail(patientId);

    return this.patientPlanService.findByPatient(patientId);
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findByIdOrFail(id);

    Object.assign(patient, updatePatientDto);

    return await this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findByIdOrFail(id);

    const hasAppointments = await this.appointmentRepository.findOne({
      where: { patientId: id },
      select: ['id'],
    });

    if (hasAppointments) {
      throw new ConflictException(
        'Cannot delete patient with linked appointments',
      );
    }

    await this.patientRepository.delete(id);

    return { message: 'Patient removed successfully' };
  }

  private async findByIdOrFail(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }
}
