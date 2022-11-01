import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hashPassword } from '../../utils/bcrypt';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: number;
  @Column({
    length: 100,
  })
  user_name: string;
  // @Column({
  //   length: 100,
  // })
  // nick_name: string;
  @Column({ select: false })
  password: string;
  // @Column()
  // avatar: string; // avatar
  @Column()
  email: string;
  @Column({
    type: 'simple-enum',
    enum: ['root', 'author', 'visitor'],
  })
  role: string; // 用户角色

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await hashPassword(this.password);
  }
}
