import { Specialty } from 'src/modules/specialty/entities/specialty.entity';
import { CustomBaseEntity } from '../../database/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
}
