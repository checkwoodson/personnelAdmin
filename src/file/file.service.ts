import { Injectable, HttpException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FileService {
  constructor(private eventEmitter: EventEmitter2) {}
  uploadSuccess(file) {
    if (!file) throw new HttpException('文件上传失败', 401);
    this.eventEmitter.emit('order.uploadSuccess', file);
  }
}
