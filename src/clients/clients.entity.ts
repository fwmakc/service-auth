import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { TypeClients } from '@src/common/common.enum';
import { ClientsRedirectsEntity } from '@src/clients_redirects/clients_redirects.entity';

@Entity({ name: 'clients' })
export class ClientsEntity extends ProtectedEntity {
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    unique: true,
  })
  client_id: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  client_secret: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  client_password: string;

  @Column({
    type: 'enum',
    enum: TypeClients,
    default: TypeClients.DEFAULT,
    nullable: true,
  })
  client_type?: TypeClients;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  client_uri: string;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  code: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'published_at',
  })
  publishedAt: Date;

  @Column({
    type: 'boolean',
    nullable: true,
    default: true,
    name: 'is_published',
  })
  isPublished: boolean;

  @OneToMany(() => ClientsRedirectsEntity, (redirect) => redirect.client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  redirects: ClientsRedirectsEntity[];
}
