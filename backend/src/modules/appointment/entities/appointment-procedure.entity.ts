import { CustomBaseEntity } from '../../database/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Procedure } from '../../procedure/entities/procedure.entity';

@Entity('appointment_procedures')
export class AppointmentProcedure extends CustomBaseEntity {
  @Column({ type: 'uuid' })
  appointmentId: string;

  @Column({ type: 'uuid' })
  procedureId: string;

  @ManyToOne(
    () => Appointment,
    (appointment) => appointment.appointmentProcedures,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @ManyToOne(() => Procedure, (procedure) => procedure.appointmentProcedures, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'procedureId' })
  procedure: Procedure;
}
