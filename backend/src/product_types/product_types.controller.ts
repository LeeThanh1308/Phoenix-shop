import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Query, HttpCode } from '@nestjs/common';
import { ProductTypesService } from './product_types.service';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRoles } from 'src/guards/roles.decorator';
import { EnumRoles } from 'src/guards/user-role.enum';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}
  @Post('cart')
  async onGetCartGuest(@Body('type') type: Array<{ quantity: number; type: number }>) {
    try {
      return await this.productTypesService.handleGetCartGuest(type);
    } catch (e) {
      throw new HttpException([], 200);
    }
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async create(@Body() createProductTypeDto: CreateProductTypeDto, @Param('id') id: number) {
    try {
      return await this.productTypesService.create(createProductTypeDto, id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async update(@Param('id') id: string, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    try {
      console.log(updateProductTypeDto);
      return await this.productTypesService.update(+id, updateProductTypeDto);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 400);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async remove(@Param('id') id: string) {
    try {
      return await this.productTypesService.remove(+id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }
}
