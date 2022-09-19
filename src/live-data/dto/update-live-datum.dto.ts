import { PartialType } from '@nestjs/swagger';
import { CreateLiveDatumDto } from './create-live-datum.dto';

export class UpdateLiveDatumDto extends PartialType(CreateLiveDatumDto) {}
