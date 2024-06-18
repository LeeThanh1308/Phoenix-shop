import { Injectable } from '@nestjs/common';
import { CreateProductsPremiseDto } from './dto/create-products_premise.dto';
import { UpdateProductsPremiseDto } from './dto/update-products_premise.dto';

@Injectable()
export class ProductsPremiseService {
  create(createProductsPremiseDto: CreateProductsPremiseDto) {
    return 'This action adds a new productsPremise';
  }

  findAll() {
    return `This action returns all productsPremise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productsPremise`;
  }

  update(id: number, updateProductsPremiseDto: UpdateProductsPremiseDto) {
    return `This action updates a #${id} productsPremise`;
  }

  remove(id: number) {
    return `This action removes a #${id} productsPremise`;
  }
}
