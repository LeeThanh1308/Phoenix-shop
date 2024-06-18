import { Injectable } from '@nestjs/common';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Slider } from './entities/slider.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SliderService {
  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
  ) {}
  async handleCreSlider(createSliderDto: CreateSliderDto) {
    const isExist = await this.sliderRepository.findOne({ where: { description: createSliderDto.description } });
    if (isExist) {
      return {
        field: {
          description: 'Description đã tồn tại!',
        },
      };
    }
    const result = await this.sliderRepository.save(createSliderDto);
    if (!result) {
      throw new Error();
    }
    return {
      message: 'Create slider thành công!',
    };
  }

  async findAll() {
    const result = await this.sliderRepository.find();
    if (!result) {
      throw new Error();
    }
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} slider`;
  }

  async update(id: number, data: { description: string; slug: string; imageUrl?: string }) {
    const slider = await this.sliderRepository.findOne({ where: { id: id }, select: ['imageUrl'] });
    if (!slider) {
      throw new Error();
    }
    const result = await this.sliderRepository.update(id, data);
    if (!result.affected) {
      throw new Error();
    }
    return {
      ...slider,
      message: 'Update slider thành công!',
    };
  }

  async findOneById(id: number, selects: (keyof Slider)[]) {
    return await this.sliderRepository.findOne({ where: { id: id }, select: [...selects] });
  }

  async remove(id: number) {
    return await this.sliderRepository.delete(id);
  }
}
