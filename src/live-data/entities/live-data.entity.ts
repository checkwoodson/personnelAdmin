import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('live_data')
export class LiveDataEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  anchor_id: number;
  @Column()
  game_id: number;
  @Column()
  union_id: number;
  @Column({
    type: 'decimal',
  })
  live_water: number;

  @Column({
    type: 'date',
  })
  date_time: string; // 表格中的日期

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
