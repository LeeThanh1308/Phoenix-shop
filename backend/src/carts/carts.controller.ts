import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateSoldDto } from 'src/solds/dto/create-sold.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req: any, @Body() createCartDto: CreateCartDto) {
    try {
      const user = req.user;
      return await this.cartsService.create(createCartDto, user.id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 400);
    }
  }

  @Post('pay')
  @UseGuards(AuthGuard)
  async onPayCart(@Req() req: any, @Body() data: { address: string; method: string; note?: string }) {
    try {
      const user = req.user;
      return await this.cartsService.handlePayCart(user.id, data);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 400);
    }
  }

  @Post('clear')
  @UseGuards(AuthGuard)
  async onClearCart(@Req() req: any) {
    try {
      const user = req.user;
      console.log(user);
      return await this.cartsService.handleClearCart(user.id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 400);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Req() req: any) {
    try {
      const user = req.user;
      console.log(user);
      return await this.cartsService.findAll(user.id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  @Get('bill')
  @UseGuards(AuthGuard)
  async onGetBillCart(@Req() req: any) {
    try {
      const user = req.user;
      return await this.cartsService.handleGetBillCart(user.id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Req() req: any, @Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    try {
      const user = req.user;
      return await this.cartsService.update(+id, user.id, updateCartDto);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Req() req: any, @Param('id') id: string) {
    try {
      const user = req.user;
      return await this.cartsService.remove(+id, user.id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }
}
