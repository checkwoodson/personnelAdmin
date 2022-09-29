import { Module } from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { LiveDataController } from './live-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity } from './entities/games.entity';
import { LiveDataEntity } from './entities/live-data.entity';
import { UnionEntity } from './entities/union.entity';
import { AnchorsEntity } from './entities/anchors.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      GamesEntity,
      LiveDataEntity,
      UnionEntity,
      AnchorsEntity,
    ]),
  ],
  controllers: [LiveDataController],
  providers: [LiveDataService],
})
export class LiveDataModule {}
