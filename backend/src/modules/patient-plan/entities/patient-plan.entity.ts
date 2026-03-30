import { CustomBaseEntity } from 'src/modules/database/entities/base.entity';
import { HealthPlan } from 'src/modules/health-plan/entities/health-plan.entity';
import { Patient } from 'src/modules/patient/entities/patient.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
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
}
