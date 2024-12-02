import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { AuthConfirmEntity } from '@src/auth_confirm/auth_confirm.entity';
import { AuthSessionsEntity } from '@src/auth_sessions/auth_sessions.entity';
import { AuthStrategiesEntity } from '@src/auth_strategies/auth_strategies.entity';
import { ClientsEntity } from '@src/clients/clients.entity';

@Entity({ name: 'auth' })
export class AuthEntity extends CommonEntity {
  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
  })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false, name: 'is_activated' })
  isActivated: boolean;

  @Column({ default: false, name: 'is_superuser' })
  isSuperuser: boolean;

  @OneToMany(() => AuthSessionsEntity, (session) => session.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sessions: AuthSessionsEntity[];

  @OneToMany(() => AuthStrategiesEntity, (strategy) => strategy.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  strategies: AuthStrategiesEntity[];

  @OneToMany(() => AuthConfirmEntity, (confirm) => confirm.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  confirm: AuthConfirmEntity[];

  @OneToMany(() => ClientsEntity, (clients) => clients.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  clients: ClientsEntity[];
}
