import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { Procedure } from './entities/procedure.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { standardizeName } from '../../common/utils/name.utils';
import { AppointmentProcedure } from '../appointment/entities/appointment-procedure.entity';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectRepository(Procedure)
    private readonly procedureRepository: Repository<Procedure>,
    @InjectRepository(AppointmentProcedure)
    private readonly appointmentProcedureRepository: Repository<AppointmentProcedure>,
  ) {}

  async create(createProcedureDto: CreateProcedureDto): Promise<Procedure> {
    const normalizedName = standardizeName(createProcedureDto.name);

    await this.ensureNameIsAvailable(normalizedName);

    const procedure = this.procedureRepository.create({
      name: normalizedName,
      price: createProcedureDto.price,
    });

    return this.procedureRepository.save(procedure);
  }

  async findAll(): Promise<Procedure[]> {
    return this.procedureRepository.find();
  }

  async findOne(id: string): Promise<Procedure> {
    return this.findByIdOrFail(id);
  }

  async update(
    id: string,
    updateProcedureDto: UpdateProcedureDto,
  ): Promise<Procedure> {
    const procedure = await this.findByIdOrFail(id);

    if (updateProcedureDto.name !== undefined) {
      const normalizedName = standardizeName(updateProcedureDto.name);

      if (normalizedName !== procedure.name) {
        await this.ensureNameIsAvailable(normalizedName);
      }

      updateProcedureDto.name = normalizedName;
    }

    Object.assign(procedure, updateProcedureDto);

    return this.procedureRepository.save(procedure);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findByIdOrFail(id);

    const hasAppointmentsLinked =
      await this.appointmentProcedureRepository.findOne({
        where: { procedureId: id },
        select: ['id'],
      });

    if (hasAppointmentsLinked) {
      throw new ConflictException(
        'Cannot delete procedure linked to appointments',
      );
    }

    await this.procedureRepository.delete(id);

    return { message: 'Procedure removed successfully' };
  }

  private async findByIdOrFail(id: string): Promise<Procedure> {
    const procedure = await this.procedureRepository.findOne({
      where: { id },
    });

    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }

    return procedure;
  }

  private async ensureNameIsAvailable(name: string): Promise<void> {
    const existingProcedure = await this.procedureRepository.findOne({
      where: { name },
    });

    if (existingProcedure) {
      throw new ConflictException('Procedure with this name already exists');
    }
  }
}
