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
  UploadedFile,
  BadRequestException,
  Req,
  Res,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRoles } from 'src/guards/roles.decorator';
import { EnumRoles } from 'src/guards/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { unlink } from 'fs';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  async create(
    @Req() request,
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFile()
    img: Express.Multer.File,
  ) {
    try {
      const { description, slug } = createSliderDto;
      console.log(img, createSliderDto);
      return await this.sliderService.handleCreSlider({ description, slug, imageUrl: img.filename });
    } catch (e) {
      throw new BadRequestException(request.fileValidator || 'Có lỗi xảy ra xin vui lòng thử lại sau!');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.sliderService.findAll();
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Get('file/:path')
  async getFile(@Res() res: Response, @Param('path') path: string) {
    Logger.log('Get file image');
    res.sendFile(path, { root: './public/sliders' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sliderService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderDto,
    @UploadedFile()
    img?: Express.Multer.File,
  ) {
    try {
      if (img) {
        const { description, slug } = updateSliderDto;
        const result = await this.sliderService.update(+id, { description, slug, imageUrl: img.filename });
        const { message, imageUrl } = result;
        unlink(`public/sliders/${imageUrl}`, async (err) => {
          Logger.error(err);
          const result = await this.sliderService.update(+id, { description, slug, imageUrl: img.filename });
          const { message } = result;
          return message;
        });
        return { message };
      } else {
        const { description, slug } = updateSliderDto;
        const result = await this.sliderService.update(+id, { description, slug });
        const { message } = result;
        return { message };
      }
    } catch (e) {
      throw new NotFoundException({ message: 'Cập slider thất bại xin vui lòng thử lại sau.', e });
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UserRoles([EnumRoles.CEO, EnumRoles.MANAGER])
  async remove(@Param('id') id: number) {
    try {
      const imageUrl = await this.sliderService.findOneById(id, ['imageUrl']);
      if (!imageUrl) {
        throw new Error();
      }
      await this.sliderService.remove(id);
      unlink(`public/sliders/${imageUrl.imageUrl}`, async (err) => {
        Logger.error(err);
        return {
          message: 'Xóa slider thành công.',
        };
      });

      return {
        message: 'Xóa slider thành công.',
      };
    } catch (error) {
      throw new NotFoundException({
        message: 'Xóa slider thất bại xin vui lòng thử lại sau.',
      });
    }
  }
}
