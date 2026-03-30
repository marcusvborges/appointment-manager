import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from '../specialty/entities/specialty.entity';
import { Appointment } from '../appointment/entities/appointment.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    await this.ensureCrmIsAvailable(createDoctorDto.crm);

    await this.checkSpecialtyExists(createDoctorDto.specialtyId);

    const doctor = this.doctorRepository.create(createDoctorDto);

    return this.doctorRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      relations: ['specialty'],
    });
  }

  async findOne(id: string): Promise<Doctor> {
    return this.findByIdOrFail(id);
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findByIdOrFail(id);

    if (
      updateDoctorDto.crm !== undefined &&
      updateDoctorDto.crm !== doctor.crm
    ) {
      await this.ensureCrmIsAvailable(updateDoctorDto.crm);
    }

    if (updateDoctorDto.specialtyId !== undefined) {
      await this.checkSpecialtyExists(updateDoctorDto.specialtyId);
    }

    Object.assign(doctor, updateDoctorDto);

    return this.doctorRepository.save(doctor);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findByIdOrFail(id);

    const hasAppointments = await this.appointmentRepository.findOne({
      where: { doctorId: id },
      select: ['id'],
    });

    if (hasAppointments) {
      throw new ConflictException(
        'Cannot delete doctor with linked appointments',
      );
    }

    await this.doctorRepository.delete(id);

    return { message: 'Doctor removed successfully' };
  }

  private async findByIdOrFail(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['specialty'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  private async checkSpecialtyExists(specialtyId: string): Promise<void> {
    const specialty = await this.specialtyRepository.findOne({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new NotFoundException('Specialty not found');
    }
  }

  private async ensureCrmIsAvailable(crm: string): Promise<void> {
    const existingDoctor = await this.doctorRepository.findOne({
      where: { crm },
    });

    if (existingDoctor) {
      throw new ConflictException('Doctor with this CRM already exists');
    }
  }
}
