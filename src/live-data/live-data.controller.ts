import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { paginationDto } from './dto/get-pagination.dto';
@Controller('live_data')
export class LiveDataController {
  constructor(private readonly liveDataService: LiveDataService) {}
  @Post()
  getExcelData(@Body() getLiveDataDto: paginationDto) {
    const { page, limit } = getLiveDataDto;
    if (page <= 0 || typeof page !== 'number') {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: '页码错误，请重新检查',
      };
    }
    return this.liveDataService.getGameData(page, limit);
  }
  @Get('getAllParameters')
  getAllParameters() {
    return this.liveDataService.getAllParameters();
  }
}
