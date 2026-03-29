import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from '../../database/entities/base.entity';

@Entity('users')
export class User extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
