import { Entity } from 'typeorm';
import { Common } from './common.entity';
@Entity('anchors')
export class AnchorsEntity extends Common {}
