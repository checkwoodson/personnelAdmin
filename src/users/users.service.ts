import {
  Injectable,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // 注册
  async register(createUser: CreateUserDto) {
    const { user_name } = createUser;
    // 用户查询
    const existUser = await this.userRepository.find({
      select: ['user_name'],
      where: { user_name: user_name },
    });
    if (existUser.length > 0) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }
}
