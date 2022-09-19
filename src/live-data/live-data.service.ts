import { Injectable } from '@nestjs/common';
import { CreateLiveDatumDto } from './dto/create-live-datum.dto';
import { UpdateLiveDatumDto } from './dto/update-live-datum.dto';

@Injectable()
export class LiveDataService {
  create(createLiveDatumDto: CreateLiveDatumDto) {
    return 'This action adds a new liveDatum';
  }

  findAll() {
    return `This action returns all liveData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} liveDatum`;
  }

  update(id: number, updateLiveDatumDto: UpdateLiveDatumDto) {
    return `This action updates a #${id} liveDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveDatum`;
  }
}
