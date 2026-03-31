import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Specialty } from '../specialty/entities/specialty.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';
import { HealthPlan } from '../health-plan/entities/health-plan.entity';
import { PatientPlan } from '../patient-plan/entities/patient-plan.entity';
import { Procedure } from '../procedure/entities/procedure.entity';
import { HashService } from '../hash/hash.service';

export async function runSeed(dataSource: DataSource) {
  const hashService = new HashService();

  console.log('Starting seed...');

  const userRepository = dataSource.getRepository(User);
  const specialtyRepository = dataSource.getRepository(Specialty);
  const doctorRepository = dataSource.getRepository(Doctor);
  const patientRepository = dataSource.getRepository(Patient);
  const healthPlanRepository = dataSource.getRepository(HealthPlan);
  const patientPlanRepository = dataSource.getRepository(PatientPlan);
  const procedureRepository = dataSource.getRepository(Procedure);

  const existingUser = await userRepository.findOne({
    where: { email: 'admin@email.com' },
  });

  if (!existingUser) {
    const user = userRepository.create({
      name: 'Admin',
      email: 'admin@email.com',
      password: await hashService.hash('12345678'),
    });

    await userRepository.save(user);
    console.log('User created');
  }

  const specialtiesData = ['cardiologia'];

  const specialties: Record<string, Specialty> = {};

  for (const specialtyName of specialtiesData) {
    let specialty = await specialtyRepository.findOne({
      where: { name: specialtyName },
    });

    if (!specialty) {
      specialty = specialtyRepository.create({
        name: specialtyName,
      });

      await specialtyRepository.save(specialty);
      console.log(`Specialty created: ${specialtyName}`);
    }

    specialties[specialtyName] = specialty;
  }

  const doctorsData = [
    {
      name: 'Dra. Ana Souza',
      crm: '654321-PE',
      specialtyName: 'cardiologia',
    },
  ];

  for (const doctorData of doctorsData) {
    const existingDoctor = await doctorRepository.findOne({
      where: { crm: doctorData.crm },
    });

    if (!existingDoctor) {
      const doctor = doctorRepository.create({
        name: doctorData.name,
        crm: doctorData.crm,
        specialtyId: specialties[doctorData.specialtyName].id,
      });

      await doctorRepository.save(doctor);
      console.log(`Doctor created: ${doctorData.name}`);
    }
  }

  const patientsData = [
    {
      name: 'Maria da Silva',
      birthDate: new Date('1990-01-01'),
      phone: '81999999999',
    },
    {
      name: 'Carlos Oliveira',
      birthDate: new Date('1985-06-15'),
      phone: '81888888888',
    },
  ];

  const patients: Record<string, Patient> = {};

  for (const patientData of patientsData) {
    let patient = await patientRepository.findOne({
      where: { phone: patientData.phone },
    });

    if (!patient) {
      patient = patientRepository.create(patientData);
      await patientRepository.save(patient);
      console.log(`Patient created: ${patientData.name}`);
    }

    patients[patientData.phone] = patient;
  }

  const healthPlansData = [
    {
      name: 'bradesco',
      phone: '0800-123-456',
    },
    {
      name: 'unimed',
      phone: '0800-987-654',
    },
  ];

  const healthPlans: Record<string, HealthPlan> = {};

  for (const healthPlanData of healthPlansData) {
    let healthPlan = await healthPlanRepository.findOne({
      where: { name: healthPlanData.name },
    });

    if (!healthPlan) {
      healthPlan = healthPlanRepository.create(healthPlanData);
      await healthPlanRepository.save(healthPlan);
      console.log(`Health plan created: ${healthPlanData.name}`);
    }

    healthPlans[healthPlanData.name] = healthPlan;
  }

  const patientPlanLinks = [
    {
      patientPhone: '81999999999',
      healthPlanName: 'bradesco',
      contractNumber: 'CONTRATO-001',
    },
  ];

  for (const linkData of patientPlanLinks) {
    const patient = patients[linkData.patientPhone];
    const healthPlan = healthPlans[linkData.healthPlanName];

    const existingPatientPlan = await patientPlanRepository.findOne({
      where: {
        patientId: patient.id,
        healthPlanId: healthPlan.id,
      },
    });

    if (!existingPatientPlan) {
      const patientPlan = patientPlanRepository.create({
        patientId: patient.id,
        healthPlanId: healthPlan.id,
        contractNumber: linkData.contractNumber,
      });

      await patientPlanRepository.save(patientPlan);
      console.log(`Link created: ${patient.name} -> ${healthPlan.name}`);
    }
  }

  const proceduresData = [
    { name: 'consulta cardiológica', price: 180 },
    { name: 'eletrocardiograma', price: 120 },
  ];

  for (const procedureData of proceduresData) {
    const existingProcedure = await procedureRepository.findOne({
      where: { name: procedureData.name },
    });

    if (!existingProcedure) {
      const procedure = procedureRepository.create(procedureData);
      await procedureRepository.save(procedure);
      console.log(`Procedure created: ${procedureData.name}`);
    }
  }

  console.log('Seed completed');
}
