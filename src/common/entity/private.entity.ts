import { Entity } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';

@Entity()
export class PrivateEntity extends ProtectedEntity {}
