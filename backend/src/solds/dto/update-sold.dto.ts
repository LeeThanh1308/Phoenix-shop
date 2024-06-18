import { PartialType } from '@nestjs/mapped-types';
import { CreateSoldDto } from './create-sold.dto';

export class UpdateSoldDto extends PartialType(CreateSoldDto) {}
