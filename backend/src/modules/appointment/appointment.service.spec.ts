import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { AppointmentProcedure } from './entities/appointment-procedure.entity';
import { Procedure } from '../procedure/entities/procedure.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../doctor/doctor.service';
import { PatientPlanService } from '../patient-plan/patient-plan.service';

type FindOptions = Record<string, unknown>;

type TransactionManager = {
  getRepository: (
    entity: typeof Appointment | typeof AppointmentProcedure,
  ) => AppointmentTxRepository | AppointmentProcedureTxRepository;
};

type AppointmentRepositoryMock = {
  findOne: jest.Mock<Promise<Appointment | null>, [FindOptions]>;
  find: jest.Mock<Promise<Appointment[]>, [FindOptions]>;
  save: jest.Mock<Promise<Appointment>, [Appointment]>;
  create: jest.Mock<Appointment, [Partial<Appointment>]>;
  delete: jest.Mock<Promise<void>, [string]>;
  manager: {
    transaction: jest.Mock<
      Promise<Appointment | void>,
      [(manager: TransactionManager) => Promise<Appointment | void>]
    >;
  };
};

type AppointmentProcedureRepositoryMock = {
  findOne: jest.Mock<Promise<AppointmentProcedure | null>, [FindOptions]>;
  find: jest.Mock<Promise<AppointmentProcedure[]>, [FindOptions]>;
  save: jest.Mock<Promise<AppointmentProcedure[]>, [AppointmentProcedure[]]>;
  create: jest.Mock<AppointmentProcedure, [Partial<AppointmentProcedure>]>;
  delete: jest.Mock<Promise<void>, [FindOptions]>;
};

type ProcedureRepositoryMock = {
  findOne: jest.Mock<Promise<Procedure | null>, [FindOptions]>;
  find: jest.Mock<Promise<Procedure[]>, [FindOptions]>;
  save: jest.Mock<Promise<Procedure>, [Procedure]>;
  create: jest.Mock<Procedure, [Partial<Procedure>]>;
  delete: jest.Mock<Promise<void>, [string]>;
};

type AppointmentTxRepository = {
  create: jest.Mock<Appointment, [Partial<Appointment>]>;
  save: jest.Mock<Promise<Appointment>, [Appointment]>;
  delete: jest.Mock<Promise<void>, [string]>;
};

type AppointmentProcedureTxRepository = {
  create: jest.Mock<AppointmentProcedure, [Partial<AppointmentProcedure>]>;
  save: jest.Mock<Promise<AppointmentProcedure[]>, [AppointmentProcedure[]]>;
  delete: jest.Mock<Promise<void>, [FindOptions]>;
};

type PatientServiceMock = {
  findOne: jest.Mock<Promise<unknown>, [string]>;
};

type DoctorServiceMock = {
  findOne: jest.Mock<Promise<unknown>, [string]>;
};

type PatientPlanServiceMock = {
  findByPatient: jest.Mock<Promise<Array<{ id: string }>>, [string]>;
};

describe('AppointmentService', () => {
  let service: AppointmentService;

  let appointmentRepository: AppointmentRepositoryMock;
  let appointmentProcedureRepository: AppointmentProcedureRepositoryMock;
  let procedureRepository: ProcedureRepositoryMock;

  let txAppointmentRepository: AppointmentTxRepository;
  let txAppointmentProcedureRepository: AppointmentProcedureTxRepository;

  let patientService: PatientServiceMock;
  let doctorService: DoctorServiceMock;
  let patientPlanService: PatientPlanServiceMock;

  const makeCreateAppointmentDto = (
    overrides: Partial<CreateAppointmentDto> = {},
  ): CreateAppointmentDto => ({
    patientId: '11111111-1111-4111-8111-111111111111',
    doctorId: '22222222-2222-4222-8222-222222222222',
    scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    isPrivate: true,
    procedureIds: ['33333333-3333-4333-8333-333333333333'],
    ...overrides,
  });

  const makeProcedure = (
    id = '33333333-3333-4333-8333-333333333333',
  ): Procedure =>
    ({
      id,
      name: 'Consulta',
      price: 100,
      appointmentProcedures: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Procedure;

  const makeAppointment = (overrides: Partial<Appointment> = {}): Appointment =>
    ({
      id: 'appointment-1',
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      patientId: '11111111-1111-4111-8111-111111111111',
      doctorId: '22222222-2222-4222-8222-222222222222',
      patientPlanId: null,
      isPrivate: true,
      patient: {} as Appointment['patient'],
      doctor: {} as Appointment['doctor'],
      patientPlan: null,
      appointmentProcedures: [
        {
          id: 'ap-1',
          appointmentId: 'appointment-1',
          procedureId: '33333333-3333-4333-8333-333333333333',
          appointment: {} as AppointmentProcedure['appointment'],
          procedure: makeProcedure(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    }) as Appointment;

  const mockRelationsAsValid = (): void => {
    patientService.findOne.mockResolvedValue({});
    doctorService.findOne.mockResolvedValue({});
    procedureRepository.find.mockResolvedValue([makeProcedure()]);
  };

  beforeEach(async () => {
    txAppointmentRepository = {
      create: jest.fn<Appointment, [Partial<Appointment>]>(
        (data: Partial<Appointment>) => data as Appointment,
      ),
      save: jest.fn<Promise<Appointment>, [Appointment]>(),
      delete: jest.fn<Promise<void>, [string]>(),
    };

    txAppointmentProcedureRepository = {
      create: jest.fn<AppointmentProcedure, [Partial<AppointmentProcedure>]>(
        (data: Partial<AppointmentProcedure>) => data as AppointmentProcedure,
      ),
      save: jest.fn<
        Promise<AppointmentProcedure[]>,
        [AppointmentProcedure[]]
      >(),
      delete: jest.fn<Promise<void>, [FindOptions]>(),
    };

    appointmentRepository = {
      findOne: jest.fn<Promise<Appointment | null>, [FindOptions]>(),
      find: jest.fn<Promise<Appointment[]>, [FindOptions]>(),
      save: jest.fn<Promise<Appointment>, [Appointment]>(),
      create: jest.fn<Appointment, [Partial<Appointment>]>(
        (data: Partial<Appointment>) => data as Appointment,
      ),
      delete: jest.fn<Promise<void>, [string]>(),
      manager: {
        transaction: jest.fn<
          Promise<Appointment | void>,
          [(manager: TransactionManager) => Promise<Appointment | void>]
        >((callback) =>
          callback({
            getRepository: (
              entity: typeof Appointment | typeof AppointmentProcedure,
            ) => {
              if (entity === Appointment) {
                return txAppointmentRepository;
              }

              return txAppointmentProcedureRepository;
            },
          }),
        ),
      },
    };

    appointmentProcedureRepository = {
      findOne: jest.fn<Promise<AppointmentProcedure | null>, [FindOptions]>(),
      find: jest.fn<Promise<AppointmentProcedure[]>, [FindOptions]>(),
      save: jest.fn<
        Promise<AppointmentProcedure[]>,
        [AppointmentProcedure[]]
      >(),
      create: jest.fn<AppointmentProcedure, [Partial<AppointmentProcedure>]>(
        (data: Partial<AppointmentProcedure>) => data as AppointmentProcedure,
      ),
      delete: jest.fn<Promise<void>, [FindOptions]>(),
    };

    procedureRepository = {
      findOne: jest.fn<Promise<Procedure | null>, [FindOptions]>(),
      find: jest.fn<Promise<Procedure[]>, [FindOptions]>(),
      save: jest.fn<Promise<Procedure>, [Procedure]>(),
      create: jest.fn<Procedure, [Partial<Procedure>]>(
        (data: Partial<Procedure>) => data as Procedure,
      ),
      delete: jest.fn<Promise<void>, [string]>(),
    };

    patientService = {
      findOne: jest.fn<Promise<unknown>, [string]>(),
    };

    doctorService = {
      findOne: jest.fn<Promise<unknown>, [string]>(),
    };

    patientPlanService = {
      findByPatient: jest.fn<Promise<Array<{ id: string }>>, [string]>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: appointmentRepository,
        },
        {
          provide: getRepositoryToken(AppointmentProcedure),
          useValue: appointmentProcedureRepository,
        },
        {
          provide: getRepositoryToken(Procedure),
          useValue: procedureRepository,
        },
        {
          provide: PatientService,
          useValue: patientService,
        },
        {
          provide: DoctorService,
          useValue: doctorService,
        },
        {
          provide: PatientPlanService,
          useValue: patientPlanService,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should create appointment successfully', async () => {
    const dto = makeCreateAppointmentDto();

    mockRelationsAsValid();

    appointmentRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeAppointment());

    txAppointmentRepository.save.mockResolvedValue(makeAppointment());
    txAppointmentProcedureRepository.save.mockResolvedValue([]);

    const result = await service.create(dto);

    expect(result).toBeDefined();
    expect(result.id).toBe('appointment-1');
    expect(appointmentRepository.manager.transaction).toHaveBeenCalled();
    expect(txAppointmentRepository.save).toHaveBeenCalled();
    expect(txAppointmentProcedureRepository.save).toHaveBeenCalled();
  });

  it('should fail if no procedures are provided', async () => {
    const dto = makeCreateAppointmentDto({
      procedureIds: [],
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should fail if procedures are duplicated', async () => {
    const procedureId = '33333333-3333-4333-8333-333333333333';

    const dto = makeCreateAppointmentDto({
      procedureIds: [procedureId, procedureId],
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should fail if appointment is scheduled in the past', async () => {
    const dto = makeCreateAppointmentDto({
      scheduledAt: new Date(Date.now() - 1000).toISOString(),
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should fail if patient is not found', async () => {
    const dto = makeCreateAppointmentDto();

    patientService.findOne.mockRejectedValue(new NotFoundException());

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should fail if doctor already has an appointment at the same time', async () => {
    const dto = makeCreateAppointmentDto();

    mockRelationsAsValid();

    appointmentRepository.findOne.mockResolvedValueOnce(makeAppointment());

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should fail if patient already has an appointment at the same time', async () => {
    const dto = makeCreateAppointmentDto();

    mockRelationsAsValid();

    appointmentRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeAppointment());

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should fail if non-private appointment does not have patient plan', async () => {
    const dto = makeCreateAppointmentDto({
      isPrivate: false,
    });

    mockRelationsAsValid();

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should fail if patient plan does not belong to patient', async () => {
    const dto = makeCreateAppointmentDto({
      isPrivate: false,
      patientPlanId: '44444444-4444-4444-8444-444444444444',
    });

    mockRelationsAsValid();
    patientPlanService.findByPatient.mockResolvedValue([{ id: 'other-plan' }]);

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
});
