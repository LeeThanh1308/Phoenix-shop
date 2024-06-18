import { PartialType } from '@nestjs/mapped-types';
import { CreatePremisesDto } from './create-premises.dto';

export class UpdatePremisesDto extends PartialType(CreatePremisesDto) {}
