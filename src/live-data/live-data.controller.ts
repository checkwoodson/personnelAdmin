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
import { CreateLiveDatumDto } from './dto/create-live-datum.dto';
import { UpdateLiveDatumDto } from './dto/update-live-datum.dto';

@Controller('live_data')
export class LiveDataController {
  constructor(private readonly liveDataService: LiveDataService) {}

  @Post()
  create(@Body() createLiveDatumDto: CreateLiveDatumDto) {
    return this.liveDataService.create(createLiveDatumDto);
  }

  @Get()
  findAll() {
    return this.liveDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liveDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLiveDatumDto: UpdateLiveDatumDto,
  ) {
    return this.liveDataService.update(+id, updateLiveDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveDataService.remove(+id);
  }
}
