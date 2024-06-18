import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/product.entity';
import { DataSource, IsNull, Like, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { unlink } from 'fs';
import { ProductType } from 'src/product_types/entities/product_type.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, imageStore: Array<Express.Multer.File>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const imageUrl = imageStore.map((value) => value.filename);
      const category = await this.categoryRepository.findOne({ where: { id: createProductDto.category } });
      if (!category) {
        throw new Error();
      }
      const slug = await this.handleConvertToSlug(createProductDto.name);
      const data = await queryRunner.manager.save(Products, {
        name: createProductDto.name,
        barcode: createProductDto.barcode,
        description: createProductDto.description,
        nsx: createProductDto.nsx,
        hsd: createProductDto.hsd,
        image: imageUrl,
        slug: slug,
        category: category,
      });
      if (!data) {
        throw new Error();
      }
      await queryRunner.commitTransaction();
      return {
        message: 'Thêm sản phẩm thành công!',
        id: data.id,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      imageStore.map(async (it) => {
        unlink(`public/products/${it.filename}`, (err) => {
          err;
        });
      });

      throw new NotFoundException({
        errMgs: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const result = await this.productsRepository.find({
      relations: {
        category: true,
        type: {
          solds: true,
        },
      },
    });

    return result.map((item) => {
      return {
        ...item,
        type: item.type.map((item) => {
          return {
            ...item,
            quantity: item.quantity,
            solds: item.solds.reduce((acc, item) => item.quantity + acc, 0),
          };
        }),
        sold: item.type.reduce((acc, item) => item.solds.reduce((accSold, current) => current.quantity + accSold, 0) + acc, 0),
        quantity: item.type.reduce((acc, item) => item.quantity + acc, 0),
      };
    });
  }

  async findOne(query: any) {
    const result = await this.productsRepository.findOne({
      relations: {
        type: {
          solds: true,
        },
      },
      where: [
        {
          id: query,
        },
        {
          slug: query,
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        barcode: true,
        image: true,
        nsx: true,
        hsd: true,
        description: true,
        type: {
          id: true,
          type: true,
          price: true,
          discount: true,
          quantity: true,
          solds: {
            id: true,
            quantity: true,
          },
        },
      },
    });
    if (!result) {
      return [];
    }

    return {
      ...result,
      type: result.type.map((it) => {
        return {
          ...it,
          quantity: it.quantity - it.solds.reduce((acc, cur) => cur.quantity + acc, 0),
          solds: it.solds.reduce((acc, cur) => cur.quantity + acc, 0),
        };
      }),
    };
  }

  async onGetAllProducts() {
    const currentDate = new Date();
    return await this.productsRepository.find({
      relations: ['category', 'type'],
      where: {
        hsd: MoreThan(currentDate),
      },
      select: {
        id: true,
        name: true,
        barcode: true,
        slug: true,
        image: true,
        category: {
          id: true,
          name: true,
          slug: true,
        },
        type: {
          id: true,
          type: true,
          price: true,
          discount: true,
          quantity: true,
        },
      },
    });
  }

  handleConvertToSlug = (value) => {
    return value
      ?.normalize('NFD')
      ?.replace(/[\u0300-\u036f]/g, '')
      .replaceAll(' ', '-')
      .replaceAll('--', '-')
      ?.toLowerCase();
  };
  async update(id: number, updateProductDto: UpdateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const slug = await this.handleConvertToSlug(updateProductDto.name);
      const status = await this.productsRepository.update(id, {
        name: updateProductDto.name,
        slug: slug,
        barcode: updateProductDto.barcode,
        description: updateProductDto.description,
        nsx: updateProductDto.nsx,
        category: {
          id: updateProductDto.category,
        },
        hsd: updateProductDto.hsd,
      });
      if (!status?.affected) {
        throw new Error();
      }

      await queryRunner.commitTransaction();
      return {
        message: 'Cập nhật thông tin sản phẩm thành công!',
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async hanldeUpdateAndUpload(id: number, files: Array<Express.Multer.File>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const imageUrl = files.map((file) => file.filename);
    try {
      const result = await this.productsRepository.findOne({ where: { id: id } });
      if (!result) {
        throw new Error();
      }
      await queryRunner.manager.save(Products, {
        ...result,
        image: [...result.image, ...imageUrl],
      });
      await queryRunner.commitTransaction();
      return {
        message: 'Xóa sản phẩm thành công!',
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async handleRemoveFile(id: number, filename: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    unlink(`public/products/${filename}`, async (err) => {
      err;
    });
    try {
      const product = await this.productsRepository.findOne({ where: { id: id } });
      console.log(filename);
      const result = await queryRunner.manager.update(Products, id, {
        image: product.image.filter((it) => {
          if (it === filename) {
            return;
          } else {
            return it;
          }
        }),
      });
      if (!result) {
        throw new Error();
      }

      await queryRunner.commitTransaction();
      return {
        message: 'Xóa ảnh thành công!',
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException({
        message: 'Có lỗi xảy ra xin vui lòng thử lại sau.',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    try {
      const findProd = await this.productsRepository.findOne({
        relations: {
          type: {
            solds: true,
          },
        },
        where: {
          id: id,
          type: {
            solds: {
              id: IsNull(),
            },
          },
        },
      });
      if (!findProd) {
        return {
          message: 'Không thể xoá sản phẩm này vì sản phẩm đã được bán.',
        };
      }

      findProd.image.map(async (item) => {
        await this.handleRemoveFile(findProd.id, item);
      });

      const result = await this.productsRepository.delete(id);
      if (!result.affected) {
        throw new Error();
      }
      return {
        message: 'Xoá sản phẩm thành công.',
      };
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 400);
    }
  }

  handleRegexSlug = (value) => {
    return value
      ?.normalize('NFD')
      ?.replace(/[\u0300-\u036f]/g, '')
      .replaceAll(' ', '-')
      .replaceAll('--', '-')
      ?.toLowerCase();
  };
  async handleSearchProducts(name: string, options: { price?: boolean; sale?: boolean; createdAt?: boolean; sold?: boolean }) {
    const result = await this.productsRepository.find({
      relations: {
        category: true,
        type: {
          solds: true,
        },
      },
      where: [
        {
          name: Like(`%${name.replaceAll(' ', '').split('').join('%')}%`),
        },
        {
          slug: Like(`%${name.replaceAll(' ', '').split('').join('%')}%`),
        },
        {
          category: {
            slug: Like(`%${name.replaceAll(' ', '').split('').join('%')}%`),
          },
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        type: {
          id: true,
          type: true,
          price: true,
          discount: true,
          quantity: true,
          solds: {
            id: true,
            quantity: true,
          },
        },
      },
      order: {
        createdAt: Number(options.createdAt) === 0 ? 'ASC' : 'DESC',
      },
    });

    return result.map((item) => {
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        image: item.image,
        category: item.category,
        type: item.type.map((item) => {
          return {
            id: item.id,
            type: item.type,
            price: item.price,
            quantity: item.quantity - item.solds.reduce((acc, cur) => cur.quantity + acc, 0),
            discount: item.discount,
            solds: item.solds.reduce((acc, item) => item.quantity + acc, 0),
          };
        }),
      };
    });
  }

  async handleTipsSearchProducts(query: string) {
    return await this.productsRepository.find({
      where: {
        slug: Like(`%${query.replaceAll(' ', '').split('').join('%')}%`),
      },
      select: ['id', 'name', 'slug'],
      take: 10,
    });
  }
}
