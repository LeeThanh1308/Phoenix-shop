import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, IsNull, MoreThan, Not, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryRepository.save(createCategoryDto);
    } catch (e) {
      throw new Error();
    }
  }

  async findAll() {
    try {
      return await this.categoryRepository.find();
    } catch (e) {
      throw new Error();
    }
  }

  async handleFindProducts() {
    const currentDate = new Date();

    try {
      const data = await this.categoryRepository.find({
        relations: {
          products: {
            type: {
              solds: true,
            },
          },
        },
        where: {
          products: {
            id: Not(IsNull()),
            hsd: MoreThan(currentDate),
            type: {
              id: Not(IsNull()),
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          products: {
            id: true,
            name: true,
            slug: true,
            barcode: true,
            image: true,
            description: true,
            nsx: true,
            hsd: true,
            type: {
              id: true,
              type: true,
              price: true,
              discount: true,
              solds: {
                id: true,
                quantity: true,
              },
            },
          },
        },
        take: 10,
      });
      return data.map((item) => {
        const result = item.products.map((product) => {
          return {
            ...product,
            type: product.type.map((item) => {
              return {
                id: item.id,
                type: item.type,
                price: item.price,
                discount: item.discount,
                solds: item.solds.reduce((acc, item) => item.quantity + acc, 0),
              };
            }),
          };
        });
        return {
          ...item,
          products: result,
        };
      });
    } catch (e) {
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const result = await this.categoryRepository.update(id, updateCategoryDto);
      if (!result.affected) {
        throw new Error();
      }
      return {
        message: 'Cập nhật danh mục thành công!',
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async remove(id: number) {
    try {
      const isExist = await this.categoryRepository.findOne({
        relations: { products: true },
        where: {
          id: id,
          products: {
            id: IsNull(),
          },
        },
      });
      if (!isExist) {
        throw new BadRequestException({
          errMgs: 'Không thể xoá danh mục này vì danh mục này đang có sản phẩm!',
        });
      }
      const result = await this.categoryRepository.delete({ id: id });
      if (!result.affected) {
        throw new Error();
      }
      return {
        message: 'Xoá danh mục thành công!',
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
