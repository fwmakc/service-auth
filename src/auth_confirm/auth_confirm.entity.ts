import { Entity, Column } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';

@Entity({ name: 'auth_confirm' })
export class AuthConfirmEntity extends ProtectedEntity {
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  type: string;
}
