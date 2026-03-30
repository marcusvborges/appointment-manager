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

  console.log('Iniciando seed...');

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
      password: await hashService.hash('123456'),
    });

    await userRepository.save(user);
    console.log('User created');
  }

  let specialty = await specialtyRepository.findOne({
    where: { name: 'ortopedia' },
  });

  if (!specialty) {
    specialty = specialtyRepository.create({
      name: 'ortopedia',
    });

    await specialtyRepository.save(specialty);
    console.log('Specialty created');
  }

  let doctor = await doctorRepository.findOne({
    where: { crm: '123456-PE' },
  });

  if (!doctor) {
    doctor = doctorRepository.create({
      name: 'Dr. João Silva',
      crm: '123456-PE',
      specialtyId: specialty.id,
    });

    await doctorRepository.save(doctor);
    console.log('Doctor created');
  }

  let patient = await patientRepository.findOne({
    where: { phone: '81999999999' },
  });

  if (!patient) {
    patient = patientRepository.create({
      name: 'Maria da Silva',
      birthDate: new Date('1990-01-01'),
      phone: '81999999999',
    });

    await patientRepository.save(patient);
    console.log('Patient created');
  }

  let healthPlan = await healthPlanRepository.findOne({
    where: { name: 'bradesco' },
  });

  if (!healthPlan) {
    healthPlan = healthPlanRepository.create({
      name: 'bradesco',
      phone: '0800-123-456',
    });

    await healthPlanRepository.save(healthPlan);
    console.log('HealthPlan created');
  }

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
      contractNumber: 'CONTRATO-001',
    });

    await patientPlanRepository.save(patientPlan);
    console.log('PatientPlan link created');
  }

  const procedures = [
    { name: 'consulta ortopédica', price: 150 },
    { name: 'raio-x', price: 80 },
  ];

  for (const procedureData of procedures) {
    const existingProcedure = await procedureRepository.findOne({
      where: { name: procedureData.name },
    });

    if (!existingProcedure) {
      const procedure = procedureRepository.create(procedureData);
      await procedureRepository.save(procedure);
      console.log(`Procedure created: ${procedureData.name}`);
    }
  }

  console.log('Seed finished');
}
