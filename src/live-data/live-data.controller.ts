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
import { paginationDto } from './dto/get-pagination.dto';
@Controller('live_data')
export class LiveDataController {
  constructor(private readonly liveDataService: LiveDataService) {}
  @Post()
  getExcelData(@Body() pageData: paginationDto) {
    const { limit, page } = pageData;
    if (page <= 0 || typeof page !== 'number') {
      return {
        code: 400,
        message: 'page小于0或者不是数字类型',
      };
    }
    return this.liveDataService.getGameData(page, limit);
  }
}
