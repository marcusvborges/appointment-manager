import { Appointment } from '../../appointment/entities/appointment.entity';
import { CustomBaseEntity } from '../../database/entities/base.entity';
import { HealthPlan } from '../../health-plan/entities/health-plan.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('patient_plans')
export class PatientPlan extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  contractNumber: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'uuid' })
  healthPlanId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => HealthPlan)
  @JoinColumn({ name: 'healthPlanId' })
  healthPlan: HealthPlan;

  @OneToMany(() => Appointment, (appointment) => appointment.patientPlan)
  appointments: Appointment[];
}
