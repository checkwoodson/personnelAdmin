import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity('live_data')
export class LiveData {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column()
  game_Name: string;
  @Column()
  live_belong: string;

  @Column()
  live_water: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
  })
  create_date: Date;
}
