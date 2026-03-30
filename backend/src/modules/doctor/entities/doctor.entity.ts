import { Specialty } from '../../specialty/entities/specialty.entity';
import { CustomBaseEntity } from '../../database/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity('doctors')
export class Doctor extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  crm: string;

  @Column({ type: 'uuid' })
  specialtyId: string;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctors)
  @JoinColumn({ name: 'specialtyId' })
  specialty: Specialty;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
