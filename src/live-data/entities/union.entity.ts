import { Entity } from 'typeorm';
import { Common } from './common.entity';

@Entity('union')
export class UnionEntity extends Common {}
