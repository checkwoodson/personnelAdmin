import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LiveDataService } from './live-data.service';

@Controller('live_data')
export class LiveDataController {
  constructor(private readonly liveDataService: LiveDataService) {}
  @Get()
  getExcelData() {
    return this.liveDataService.getGameData();
  }
}
