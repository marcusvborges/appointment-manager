import { Column, Entity, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../../database/entities/base.entity';
import { AppointmentProcedure } from '../../appointment/entities/appointment-procedure.entity';

@Entity('procedures')
export class Procedure extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @OneToMany(
    () => AppointmentProcedure,
    (appointmentProcedure) => appointmentProcedure.procedure,
  )
  appointmentProcedures: AppointmentProcedure[];
}
