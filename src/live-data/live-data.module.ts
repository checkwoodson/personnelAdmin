import { Module } from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { LiveDataController } from './live-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveData } from './entities/live-data.entity';
@Module({
  imports: [TypeOrmModule.forFeature([LiveData])],
  controllers: [LiveDataController],
  providers: [LiveDataService],
})
export class LiveDataModule {}
