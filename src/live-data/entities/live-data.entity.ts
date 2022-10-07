import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AnchorsEntity } from './anchors.entity';
import { GamesEntity } from './games.entity';
import { UnionEntity } from './union.entity';
@Entity('live_data')
export class LiveDataEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => AnchorsEntity)
  @JoinColumn({ name: 'anchor_id' })
  anchor: AnchorsEntity;

  @ManyToOne(() => GamesEntity)
  @JoinColumn({ name: 'game_id' })
  game: GamesEntity;
  @ManyToOne(() => UnionEntity)
  @JoinColumn({ name: 'union_id' })
  union: UnionEntity;

  @Column({
    type: 'decimal',
  })
  live_water: number;

  @Column({
    type: 'date',
  })
  date_time: Date; // 表格中的日期

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
  })
  create_time: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'update_date',
  })
  update_time: Date;
}
