import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LiveDataModule } from './live-data/live-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'Devops2020',
      database: 'personnel',
      entities: ['dist/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    LiveDataModule,
  ],
  // imports: [AppModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
