import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsPremiseDto } from './create-products_premise.dto';

export class UpdateProductsPremiseDto extends PartialType(CreateProductsPremiseDto) {}
