import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product_type.entity';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectRepository(ProductType)
    private readonly typeRepository: Repository<ProductType>,
  ) {}

  async create(createProductTypeDto: CreateProductTypeDto, id: number) {
    try {
      const result = await this.typeRepository.save({
        ...createProductTypeDto,
        products: {
          id,
        },
      });
      if (!result) {
        throw new Error();
      }
      return {
        message: 'Thêm kiểu loại sản phẩm thành công.',
      };
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  async handleGetCartGuest(data: Array<{ quantity: number; type: number }>) {
    console.log(data);
    const typeId = await data.map((item) => {
      return item.type;
    });
    const result = await this.typeRepository.find({
      relations: ['products'],
      where: {
        id: In(typeId),
      },
      select: {
        id: true,
        type: true,
        price: true,
        discount: true,
        products: {
          id: true,
          name: true,
          image: true,
        },
      },
    });

    const cart = result.map((item, i) => {
      const price = item.price;
      const quantity = data[i].quantity;
      const total = price * quantity - ((price * quantity) / 100) * item.discount;
      return {
        id: item.id,
        quantity,
        price: price,
        discount: item.price - (price / 100) * item.discount,
        total,
        save: price * quantity - total,
        type: item.type,
        name: item.products.name,
        image: item.products.image[0],
      };
    });

    const bill = cart.reduce(
      (acc, item) => {
        return {
          quantity: item.quantity + acc.quantity,
          price: item.price * item.quantity + acc.price,
          discount: item.discount * item.quantity + acc.discount,
          total: item.total + acc.total,
          save: item.save + acc.save,
        };
      },
      {
        quantity: 0,
        price: 0,
        discount: 0,
        total: 0,
        save: 0,
      },
    );

    return {
      cart,
      bill,
    };
  }

  async update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    try {
      const result = await this.typeRepository.update(id, updateProductTypeDto);
      if (!result.affected) {
        throw new Error();
      }
      const data = await this.typeRepository.findOne({ where: { id: id } });
      return {
        message: 'Cập nhật kiểu loại sản phẩm thành công.',
        data,
      };
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 400);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.typeRepository.delete(id);
      if (!result.affected) {
        throw new Error();
      }
      return {
        message: 'Xóa kiểu loại sản phẩm thành công.',
      };
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }
}
