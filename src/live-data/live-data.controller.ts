import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('live_data')
export class LiveDataController {
  constructor(private readonly liveDataService: LiveDataService) {}
  @Get()
  test() {
    return '这是个测试是否跨域的接口';
  }
  // fileupload 单独抽离
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(
  //   @UploadedFile()
  //   file: Express.Multer.File,
  // ) {
  //   return this.liveDataService.uploadFile(file);
  // }
}
