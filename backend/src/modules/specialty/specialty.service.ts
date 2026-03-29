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

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async create(createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    const normalizedName = this.normalizeName(createSpecialtyDto.name);

    const existingSpecialty = await this.specialtyRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingSpecialty) {
      throw new ConflictException('Specialty with this name already exists');
    }

    const specialty = this.specialtyRepository.create({
      name: normalizedName,
    });

    return this.specialtyRepository.save(specialty);
  }

  async findAll() {
    return this.specialtyRepository.find();
  }

  async findOne(id: string) {
    return await this.findByIdOrFail(id);
  }

  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {
    const specialty = await this.findByIdOrFail(id);

    if (updateSpecialtyDto.name !== undefined) {
      const normalizedName = this.normalizeName(updateSpecialtyDto.name);

      if (normalizedName !== specialty.name) {
        const existingSpecialty = await this.specialtyRepository.findOne({
          where: { name: normalizedName },
        });

        if (existingSpecialty) {
          throw new ConflictException(
            'Specialty with this name already exists',
          );
        }
      }

      updateSpecialtyDto.name = normalizedName;
    }

    Object.assign(specialty, updateSpecialtyDto);

    return this.specialtyRepository.save(specialty);
  }

  async remove(id: string) {
    await this.findOne(id);
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

  private normalizeName(name: string): string {
    return name.trim().toLowerCase();
  }
}
