import { PartialType } from '@nestjs/mapped-types';
import { CreateProductTypeDto } from './create-product_type.dto';

export class UpdateProductTypeDto extends PartialType(CreateProductTypeDto) {}
