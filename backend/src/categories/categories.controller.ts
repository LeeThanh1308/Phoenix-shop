import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRoles } from 'src/guards/roles.decorator';
import { EnumRoles } from 'src/guards/user-role.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get('products')
  async onFindProducts() {
    return await this.categoriesService.handleFindProducts();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.categoriesService.update(+id, updateCategoryDto);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async remove(@Param('id') id: string) {
    try {
      return await this.categoriesService.remove(+id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }
}
