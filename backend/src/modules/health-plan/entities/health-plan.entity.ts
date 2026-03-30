import { CustomBaseEntity } from '../../database/entities/base.entity';
import { PatientPlan } from '../../patient-plan/entities/patient-plan.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('health_plans')
export class HealthPlan extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @OneToMany(() => PatientPlan, (patientPlan) => patientPlan.healthPlan)
  patientPlans: PatientPlan[];
}
