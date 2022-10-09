import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { paginationDto } from './dto/get-pagination.dto';
@Controller('live_data')
export class LiveDataController {
  constructor(private readonly liveDataService: LiveDataService) {}
  @Post()
  getExcelData(@Body() getLiveDataDto: paginationDto) {
    const { page } = getLiveDataDto;
    if (page <= 0 || typeof page !== 'number') {
      throw new HttpException('页码错误请重新检查', HttpStatus.FORBIDDEN);
    }
    return this.liveDataService.getGameData(getLiveDataDto);
  }
  @Get('getAllParameters')
  getAllParameters() {
    return this.liveDataService.getAllParameters();
  }
}
