import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentProcedure } from './entities/appointment-procedure.entity';
import { Procedure } from '../procedure/entities/procedure.entity';
import { Repository, In, Not } from 'typeorm';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../doctor/doctor.service';
import { PatientPlanService } from '../patient-plan/patient-plan.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentProcedure)
    private readonly appointmentProcedureRepository: Repository<AppointmentProcedure>,
    @InjectRepository(Procedure)
    private readonly procedureRepository: Repository<Procedure>,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly patientPlanService: PatientPlanService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const scheduledAt = new Date(createAppointmentDto.scheduledAt);

    this.validateScheduledAt(scheduledAt);
    this.validateProcedureIds(createAppointmentDto.procedureIds);

    await this.validateRelations(
      createAppointmentDto.patientId,
      createAppointmentDto.doctorId,
      createAppointmentDto.procedureIds,
    );

    await this.validateBusinessRules({
      patientId: createAppointmentDto.patientId,
      doctorId: createAppointmentDto.doctorId,
      patientPlanId: createAppointmentDto.patientPlanId,
      isPrivate: createAppointmentDto.isPrivate,
      scheduledAt,
    });

    const savedAppointment =
      await this.appointmentRepository.manager.transaction(async (manager) => {
        const appointmentRepository = manager.getRepository(Appointment);
        const appointmentProcedureRepository =
          manager.getRepository(AppointmentProcedure);

        const appointment = appointmentRepository.create({
          scheduledAt,
          patientId: createAppointmentDto.patientId,
          doctorId: createAppointmentDto.doctorId,
          patientPlanId: createAppointmentDto.patientPlanId ?? null,
          isPrivate: createAppointmentDto.isPrivate,
        });

        const savedAppointment = await appointmentRepository.save(appointment);

        const appointmentProcedures = createAppointmentDto.procedureIds.map(
          (procedureId) =>
            appointmentProcedureRepository.create({
              appointmentId: savedAppointment.id,
              procedureId,
            }),
        );

        await appointmentProcedureRepository.save(appointmentProcedures);

        return savedAppointment;
      });

    return this.findOne(savedAppointment.id);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: [
        'patient',
        'doctor',
        'patientPlan',
        'appointmentProcedures',
        'appointmentProcedures.procedure',
      ],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    return this.findByIdOrFail(id);
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findByIdOrFail(id);

    const scheduledAt = updateAppointmentDto.scheduledAt
      ? new Date(updateAppointmentDto.scheduledAt)
      : appointment.scheduledAt;

    const patientId = updateAppointmentDto.patientId ?? appointment.patientId;
    const doctorId = updateAppointmentDto.doctorId ?? appointment.doctorId;
    const isPrivate = updateAppointmentDto.isPrivate ?? appointment.isPrivate;
    const patientPlanId =
      updateAppointmentDto.patientPlanId !== undefined
        ? updateAppointmentDto.patientPlanId
        : appointment.patientPlanId;
    const procedureIds =
      updateAppointmentDto.procedureIds ??
      appointment.appointmentProcedures.map(
        (appointmentProcedure) => appointmentProcedure.procedureId,
      );

    this.validateScheduledAt(scheduledAt);
    this.validateProcedureIds(procedureIds);

    await this.validateRelations(patientId, doctorId, procedureIds);

    await this.validateBusinessRules({
      patientId,
      doctorId,
      patientPlanId: patientPlanId ?? undefined,
      isPrivate,
      scheduledAt,
      ignoreAppointmentId: id,
    });

    await this.appointmentRepository.manager.transaction(async (manager) => {
      const appointmentRepository = manager.getRepository(Appointment);
      const appointmentProcedureRepository =
        manager.getRepository(AppointmentProcedure);

      appointment.scheduledAt = scheduledAt;
      appointment.patientId = patientId;
      appointment.doctorId = doctorId;
      appointment.patientPlanId = patientPlanId ?? null;
      appointment.isPrivate = isPrivate;

      await appointmentRepository.save(appointment);

      await appointmentProcedureRepository.delete({ appointmentId: id });

      const appointmentProcedures = procedureIds.map((procedureId) =>
        appointmentProcedureRepository.create({
          appointmentId: id,
          procedureId,
        }),
      );

      await appointmentProcedureRepository.save(appointmentProcedures);
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findByIdOrFail(id);

    await this.appointmentRepository.manager.transaction(async (manager) => {
      const appointmentRepository = manager.getRepository(Appointment);
      const appointmentProcedureRepository =
        manager.getRepository(AppointmentProcedure);

      await appointmentProcedureRepository.delete({ appointmentId: id });
      await appointmentRepository.delete(id);
    });

    return { message: 'Appointment removed successfully' };
  }

  private async findByIdOrFail(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: [
        'patient',
        'doctor',
        'patientPlan',
        'appointmentProcedures',
        'appointmentProcedures.procedure',
      ],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  private validateScheduledAt(scheduledAt: Date): void {
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Invalid scheduledAt');
    }

    if (scheduledAt < new Date()) {
      throw new BadRequestException('Appointment cannot be in the past');
    }
  }

  private validateProcedureIds(procedureIds: string[]): void {
    if (!procedureIds.length) {
      throw new BadRequestException('At least one procedure must be informed');
    }

    const uniqueProcedureIds = new Set(procedureIds);

    if (uniqueProcedureIds.size !== procedureIds.length) {
      throw new BadRequestException('Duplicate procedures are not allowed');
    }
  }

  private async validateRelations(
    patientId: string,
    doctorId: string,
    procedureIds: string[],
  ): Promise<void> {
    await this.patientService.findOne(patientId);
    await this.doctorService.findOne(doctorId);

    const procedures = await this.procedureRepository.find({
      where: { id: In(procedureIds) },
    });

    if (procedures.length !== procedureIds.length) {
      throw new NotFoundException('One or more procedures were not found');
    }
  }

  private async validateBusinessRules(params: {
    patientId: string;
    doctorId: string;
    patientPlanId?: string;
    isPrivate: boolean;
    scheduledAt: Date;
    ignoreAppointmentId?: string;
  }): Promise<void> {
    const {
      patientId,
      doctorId,
      patientPlanId,
      isPrivate,
      scheduledAt,
      ignoreAppointmentId,
    } = params;

    if (!isPrivate && !patientPlanId) {
      throw new BadRequestException(
        'Patient plan is required for non-private appointments',
      );
    }

    if (isPrivate && patientPlanId) {
      throw new BadRequestException(
        'Private appointment cannot have patient plan',
      );
    }

    if (patientPlanId) {
      const patientPlans =
        await this.patientPlanService.findByPatient(patientId);

      const belongsToPatient = patientPlans.some(
        (patientPlan) => patientPlan.id === patientPlanId,
      );

      if (!belongsToPatient) {
        throw new BadRequestException(
          'Patient plan does not belong to patient',
        );
      }
    }

    const doctorConflict = await this.appointmentRepository.findOne({
      where: {
        doctorId,
        scheduledAt,
        ...(ignoreAppointmentId && { id: Not(ignoreAppointmentId) }),
      },
    });

    if (doctorConflict) {
      throw new ConflictException(
        'Doctor already has an appointment at this time',
      );
    }

    const patientConflict = await this.appointmentRepository.findOne({
      where: {
        patientId,
        scheduledAt,
        ...(ignoreAppointmentId && { id: Not(ignoreAppointmentId) }),
      },
    });

    if (patientConflict) {
      throw new ConflictException(
        'Patient already has an appointment at this time',
      );
    }
  }
}
