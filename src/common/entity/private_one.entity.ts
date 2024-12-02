import { Entity } from 'typeorm';
import { ProtectedOneEntity } from '@src/common/entity/protected_one.entity';

@Entity()
export class PrivateOneEntity extends ProtectedOneEntity {}
