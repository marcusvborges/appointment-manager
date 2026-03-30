import { PatientPlan } from '../../patient-plan/entities/patient-plan.entity';
import { CustomBaseEntity } from '../../database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity('patients')
export class Patient extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @OneToMany(() => PatientPlan, (patientPlan) => patientPlan.patient)
  patientPlans: PatientPlan[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
