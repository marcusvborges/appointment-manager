import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { Repository } from 'typeorm';
import { Doctor } from '../doctor/entities/doctor.entity';
import { standardizeName } from '../../common/utils/name.utils';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    const normalizedName = standardizeName(createSpecialtyDto.name);

    await this.ensureNameIsAvailable(normalizedName);

    const specialty = this.specialtyRepository.create({
      name: normalizedName,
    });

    return this.specialtyRepository.save(specialty);
  }

  async findAll(): Promise<Specialty[]> {
    return this.specialtyRepository.find();
  }

  async findOne(id: string): Promise<Specialty> {
    return await this.findByIdOrFail(id);
  }

  async update(
    id: string,
    updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<Specialty> {
    const specialty = await this.findByIdOrFail(id);

    if (updateSpecialtyDto.name !== undefined) {
      const normalizedName = standardizeName(updateSpecialtyDto.name);

      if (normalizedName !== specialty.name) {
        await this.ensureNameIsAvailable(normalizedName);
      }

      updateSpecialtyDto.name = normalizedName;
    }

    Object.assign(specialty, updateSpecialtyDto);

    return this.specialtyRepository.save(specialty);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findByIdOrFail(id);

    const hasDoctorsLinked = await this.doctorRepository.findOne({
      where: { specialtyId: id },
      select: ['id'],
    });

    if (hasDoctorsLinked) {
      throw new ConflictException(
        'Cannot delete specialty with linked doctors',
      );
    }

    await this.specialtyRepository.delete(id);

    return { message: 'Specialty removed successfully' };
  }

  private async findByIdOrFail(id: string): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOne({ where: { id } });

    if (!specialty) {
      throw new NotFoundException('Specialty not found');
    }

    return specialty;
  }

  private async ensureNameIsAvailable(name: string): Promise<void> {
    const existingSpecialty = await this.specialtyRepository.findOne({
      where: { name },
    });

    if (existingSpecialty) {
      throw new ConflictException('Specialty with this name already exists');
    }
  }
}
