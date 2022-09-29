import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
@Entity('live_data')
export class LiveDataEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Index()
  @Column()
  anchor_id: number;

  @Index()
  @Column()
  game_id: number;
  @Index()
  @Column()
  union_id: number;

  @Column({
    type: 'decimal',
  })
  live_water: number;

  @CreateDateColumn({
    type: 'timestamp',
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
