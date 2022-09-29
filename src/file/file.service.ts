import { HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FileService {
  constructor(private eventEmitter: EventEmitter2) {}
  uploadSuccess(file) {
    if (!file) return { code: HttpStatus.NOT_FOUND, message: '文件上传失败' };
    this.eventEmitter.emit('order.uploadSuccess', file);
    return { code: 200, message: '文件上传成功，请等待处理' };
  }
}
