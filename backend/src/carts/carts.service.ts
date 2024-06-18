import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Sold } from 'src/solds/entities/sold.entity';
import { CreateSoldDto } from 'src/solds/dto/create-sold.dto';
import { find } from 'rxjs';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCartDto: CreateCartDto, userId: string) {
    const isExist = await this.cartRepository.findOne({
      where: {
        account: {
          id: userId,
        },
        type: {
          id: createCartDto.type,
        },
      },
    });
    if (!isExist) {
      const result = await this.cartRepository.save({
        quantity: +createCartDto.quantity,
        account: { id: userId },
        type: { id: createCartDto.type },
      });
      if (!result) {
        throw new Error();
      }
      return {
        message: 'Thêm sản phẩm vào giỏ hàng thành công.',
      };
    }

    const result = await this.cartRepository.update(
      { id: isExist.id },
      {
        quantity: isExist.quantity + createCartDto.quantity,
      },
    );

    if (!result.affected) {
      throw new Error();
    }

    return {
      message: 'Thêm sản phẩm vào giỏ hàng thành công.',
    };
  }

  async findAll(id: string) {
    const result = await this.cartRepository.find({
      relations: {
        type: {
          products: true,
        },
        account: true,
      },
      where: {
        id: Not(IsNull()),
        account: {
          id: id,
        },
        type: {
          id: Not(IsNull()),
          products: {
            id: Not(IsNull()),
          },
        },
      },
      select: {
        type: {
          id: true,
          price: true,
          discount: true,
          type: true,
          products: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!result) {
      return [];
    }

    const data = await result.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
        price: item.type.price,
        discount: item.type.price - (item.type.price / 100) * item.type.discount,
        total: item.type.price * item.quantity - ((item.type.price * item.quantity) / 100) * item.type.discount,
        type: item.type.type,
        typeId: item.type.id,
        name: item.type.products.name,
        image: item.type.products.image[0],
      };
    });
    return data;
  }

  async handleGetBillCart(userId: string) {
    const result = await this.cartRepository.find({
      relations: {
        type: {
          products: true,
        },
      },
      where: {
        account: {
          id: userId,
        },
      },
      select: {
        type: {
          id: true,
          price: true,
          discount: true,
          products: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!result) {
      return [];
    }

    return result.reduce(
      (acc, item) => {
        const quantity = item.quantity + acc.quantity;
        const price = item.type.price * item.quantity + acc.price;
        const discount = item.type.price * item.quantity - ((item.type.price * item.quantity) / 100) * item.type.discount + acc.discount;
        const total = item.type.price * item.quantity - ((item.type.price * item.quantity) / 100) * item.type.discount + acc.total;
        return {
          price: price,
          discount: discount,
          quantity: quantity,
          save: price - discount,
          total: total,
        };
      },
      {
        price: 0,
        discount: 0,
        quantity: 0,
        save: 0,
        total: 0,
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(id: number, userId: string, updateCartDto: UpdateCartDto) {
    if (updateCartDto.quantity <= 0) {
      const result = await this.cartRepository.delete({ type: { id: id }, account: { id: userId } });
      if (!result.affected) {
        throw new Error();
      }
      return {
        message: 'Xóa sản phẩm thành công.',
      };
    } else {
      const result = await this.cartRepository.update(
        {
          type: {
            id: id,
          },
          account: {
            id: userId,
          },
        },
        {
          quantity: updateCartDto.quantity,
        },
      );
      if (!result.affected) {
        throw new Error();
      }

      return {
        message: 'Cập nhật giỏ hàng thành công.',
      };
    }
  }

  async remove(id: number, userId: string) {
    const result = await this.cartRepository.delete({ id: id, account: { id: userId } });
    if (!result.affected) {
      throw new Error();
    }

    return {
      message: 'Xóa sản phẩm thành công.',
    };
  }

  async handlePayCart(userID: string, data: { address: string; method: string; note?: string }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const carts = await this.findAll(userID);
      if (Array.isArray(carts) && carts.length > 0 && data.address && data.method) {
        const result = carts.map(async (item) => {
          const result = await queryRunner.manager.create(Sold, {
            quantity: item.quantity,
            price: item.discount,
            address: data?.address,
            method: data?.method,
            note: data?.note,
            account: {
              id: userID,
            },
            type: {
              id: item.typeId,
            },
          });
          await queryRunner.manager.save(result);
        });
        if (!result) {
          throw new Error();
        }
        const clearCart = await queryRunner.manager.delete(Cart, {
          account: {
            id: userID,
          },
        });
        if (!clearCart.affected) {
          throw new Error();
        }
        await queryRunner.commitTransaction();
        return {
          message: 'Thanh toán sản phẩm thành công.',
        };
      } else {
        throw new Error();
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async handleClearCart(userID: string) {
    const result = await this.cartRepository.delete({
      account: {
        id: userID,
      },
    });
    if (!result.affected) {
      throw new Error();
    }

    return {
      message: 'Xóa giỏ hàng thành công.',
    };
  }
}
