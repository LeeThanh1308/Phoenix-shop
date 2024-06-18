import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  UseGuards,
  HttpCode,
  Req,
  HttpException,
} from '@nestjs/common';
import { PremisesService } from './premises.service';
import { CreatePremisesDto } from './dto/create-premises.dto';
import { UpdatePremisesDto } from './dto/update-premises.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRoles } from 'src/guards/roles.decorator';
import { EnumRoles } from 'src/guards/user-role.enum';

@Controller('premises')
export class PremisesController {
  constructor(private readonly premisesService: PremisesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async create(@Body() createPremisesDto: CreatePremisesDto) {
    try {
      return await this.premisesService.create(createPremisesDto);
    } catch (e) {
      throw new BadRequestException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    }
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  async findAll(@Req() req: any) {
    try {
      const user = req.user;
      return await this.premisesService.findAll(user.rating);
    } catch (error) {
      throw new NotFoundException({
        message: 'Không tìm thấy dữ liệu',
      });
    }
  }

  @Get('shop/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  async getOnePermise(@Req() req: any, @Param('id') id: string) {
    try {
      const user = req.user;
      return await this.premisesService.findOne(+id, user.rating);
    } catch (error) {
      throw new NotFoundException({
        message: 'Không tìm thấy dữ liệu',
      });
    }
  }

  @Get('products/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER, EnumRoles.STAFF])
  async onGetProductsPermise(@Param('id') id: string) {
    try {
      return await this.premisesService.handleGetProductsPermise(+id);
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  @Patch('shop/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async update(@Param('id') id: number, @Body() updatePremisesDto: UpdatePremisesDto) {
    try {
      return await this.premisesService.update(+id, updatePremisesDto);
    } catch (e) {
      throw new BadRequestException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
        e,
      });
    }
  }

  @Delete(':id')
  @UserRoles([EnumRoles.CEO])
  remove(@Param('id') id: string) {
    try {
      return this.premisesService.remove(+id);
    } catch (e) {
      throw new BadRequestException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    }
  }

  @Delete('role/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  async onDeleteRolePremises(@Req() req: any, @Param('id') id: string) {
    try {
      const user = req.user;
      return await this.premisesService.handleDeleteRolePremises(id, user.rating);
    } catch (error) {
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    }
  }

  @Get('role/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async onGetRolePremises(@Param('id') id: number) {
    try {
      return await this.premisesService.hanldeDetailPremises(id);
    } catch (e) {
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    }
  }

  @Get('accounts')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO])
  async onGetAccountsRoles() {
    try {
      return await this.premisesService.handleGetAccountsRoles();
    } catch (e) {
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    }
  }

  @Patch('accounts')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  async onUpdateRoleAccount(@Req() req: any, @Body() data: { id: string; role?: any; roles?: any }) {
    try {
      const user = req.user;

      if (data?.role && user.rating > 2) {
        throw new Error();
      }
      if (data?.roles && user.rating > 3) {
        throw new Error();
      }

      return await this.premisesService.handleUpdateRoleAccount(data);
    } catch (e) {
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    }
  }

  @Get('total')
  async onGetTotalPersonnel() {
    return await this.premisesService.handleGetTotalPersonnel();
  }
}
