import { CustomBaseEntity } from '../../database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';

@Entity('specialties')
export class Specialty extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @OneToMany(() => Doctor, (doctor) => doctor.specialty)
  doctors: Doctor[];
}
