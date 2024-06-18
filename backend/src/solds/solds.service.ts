import { Injectable } from '@nestjs/common';
import { CreateSoldDto } from './dto/create-sold.dto';
import { UpdateSoldDto } from './dto/update-sold.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sold } from './entities/sold.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SoldsService {
  constructor(
    @InjectRepository(Sold)
    private readonly soldRepository: Repository<Sold>,
  ) {}

  async create(createSoldDto: CreateSoldDto, userID: string) {
    return await this.soldRepository.save({
      ...createSoldDto,
      account: {
        id: userID,
      },
    });
  }

  async findAll(userID: string) {
    const result = await this.soldRepository.find({
      relations: {
        type: {
          products: true,
        },
      },
      where: {
        account: {
          id: userID,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return result.map((data) => {
      return {
        ...data,
        name: data.type.products.name,
        price: data.price,
        image: data.type.products.image[0],
        type: data.type.type,
      };
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} sold`;
  }

  update(id: number, updateSoldDto: UpdateSoldDto) {
    return `This action updates a #${id} sold`;
  }

  remove(id: number) {
    return `This action removes a #${id} sold`;
  }
}
