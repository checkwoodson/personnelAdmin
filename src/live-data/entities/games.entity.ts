import { Entity } from 'typeorm';
import { Common } from './common.entity';

@Entity('games')
export class GamesEntity extends Common {}
