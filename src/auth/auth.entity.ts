import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { TokenEntity } from '@src/token/token.entity';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { ConfirmEntity } from '@src/confirm/confirm.entity';
import { ClientsEntity } from '@src/clients/clients.entity';
import { RolesEntity } from '@src/roles/roles.entity';
import { UsersEntity } from '@src/users/users.entity';

@ObjectType()
@Entity({ name: 'auth' })
export class AuthEntity extends CommonEntity {
  @Field()
  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
  })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_activated' })
  isActivated: boolean;

  @Field({ nullable: true })
  token: TokenEntity;

  @OneToMany(() => SessionsEntity, (session) => session.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sessions: SessionsEntity[];

  @OneToMany(() => StrategiesEntity, (strategy) => strategy.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  strategies: StrategiesEntity[];

  @OneToMany(() => ConfirmEntity, (confirm) => confirm.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  confirm: ConfirmEntity[];

  @OneToMany(() => ClientsEntity, (clients) => clients.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  clients: ClientsEntity[];

  @OneToMany(() => RolesEntity, (roles) => roles.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roles: RolesEntity[];
}
