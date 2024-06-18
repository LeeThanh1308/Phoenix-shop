import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpCode,
  Res,
  Logger,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRoles } from 'src/guards/roles.decorator';
import { EnumRoles } from 'src/guards/user-role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response, query } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  @UseInterceptors(FilesInterceptor('files'))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      return await this.productsService.create(createProductDto, files);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 400);
    }
  }

  @Get('stores')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get('search/:name')
  @HttpCode(200)
  async onSearchProducts(@Param('name') name: string, @Query('price') price: boolean, @Query('createdAt') createdAt: boolean) {
    return await this.productsService.handleSearchProducts(name, { price, createdAt });
  }

  @Get('tips/:query')
  @HttpCode(200)
  async onTipsSearchProducts(@Param('query') query: string) {
    console.log(query);
    return await this.productsService.handleTipsSearchProducts(query);
  }

  @Get('detail/:id')
  @HttpCode(200)
  async findOne(@Param('id') query: any) {
    return await this.productsService.findOne(query);
  }

  @Get('file/:path')
  async getFile(@Res() res: Response, @Param('path') path: string) {
    Logger.log('Get file image');
    if (path) {
      res.sendFile(path, { root: './public/products' });
    } else {
      return '';
    }
  }

  @Get()
  async onGetProducts() {
    return await this.productsService.onGetAllProducts();
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files?: Array<Express.Multer.File>) {
    try {
      if (files.length > 0) {
        await this.productsService.hanldeUpdateAndUpload(+id, files);
      }
      return await this.productsService.update(+id, updateProductDto);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async remove(@Param('id') id: string) {
    try {
      return await this.productsService.remove(+id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  @Delete('file/:id/:filename')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async onDeleteImage(@Param() data: { id: string; filename: string }) {
    try {
      console.log(data);
      return await this.productsService.handleRemoveFile(+data.id, data.filename);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }
}
