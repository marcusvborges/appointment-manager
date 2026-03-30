import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../../database/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { PatientPlan } from '../../patient-plan/entities/patient-plan.entity';
import { AppointmentProcedure } from './appointment-procedure.entity';

@Entity('appointments')
export class Appointment extends CustomBaseEntity {
  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'uuid' })
  doctorId: string;

  @Column({ type: 'uuid', nullable: true })
  patientPlanId: string | null;

  @Column({ type: 'boolean', default: true })
  isPrivate: boolean;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @ManyToOne(() => PatientPlan, { nullable: true })
  @JoinColumn({ name: 'patientPlanId' })
  patientPlan: PatientPlan | null;

  @OneToMany(
    () => AppointmentProcedure,
    (appointmentProcedure) => appointmentProcedure.appointment,
    { cascade: false },
  )
  appointmentProcedures: AppointmentProcedure[];
}
