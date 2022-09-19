import { Test, TestingModule } from '@nestjs/testing';
import { LiveDataController } from './live-data.controller';
import { LiveDataService } from './live-data.service';

describe('LiveDataController', () => {
  let controller: LiveDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveDataController],
      providers: [LiveDataService],
    }).compile();

    controller = module.get<LiveDataController>(LiveDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
