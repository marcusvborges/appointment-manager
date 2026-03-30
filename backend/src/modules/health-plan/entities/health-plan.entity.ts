import { CustomBaseEntity } from 'src/modules/database/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('health_plans')
export class HealthPlan extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;
}
