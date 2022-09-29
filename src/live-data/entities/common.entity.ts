import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Common {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
