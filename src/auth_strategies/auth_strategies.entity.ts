import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';

@Entity({ name: 'auth_strategies' })
@Index(['name', 'uid'], { unique: true })
export class AuthStrategiesEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  uid: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  json?: string;

  @Column({
    type: 'text',
    name: 'access_token',
    nullable: true,
  })
  accessToken?: string;

  @Column({
    type: 'text',
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken?: string;

  @ManyToOne(() => AuthEntity, (auth) => auth.strategies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;
}
