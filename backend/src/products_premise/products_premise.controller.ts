import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsPremiseService } from './products_premise.service';
import { CreateProductsPremiseDto } from './dto/create-products_premise.dto';
import { UpdateProductsPremiseDto } from './dto/update-products_premise.dto';

@Controller('products-premise')
export class ProductsPremiseController {
  constructor(private readonly productsPremiseService: ProductsPremiseService) {}

  @Post()
  create(@Body() createProductsPremiseDto: CreateProductsPremiseDto) {
    return this.productsPremiseService.create(createProductsPremiseDto);
  }

  @Get()
  findAll() {
    return this.productsPremiseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsPremiseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsPremiseDto: UpdateProductsPremiseDto) {
    return this.productsPremiseService.update(+id, updateProductsPremiseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsPremiseService.remove(+id);
  }
}
