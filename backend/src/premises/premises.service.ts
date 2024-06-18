import { HttpException, Injectable } from '@nestjs/common';
import { CreatePremisesDto } from './dto/create-premises.dto';
import { UpdatePremisesDto } from './dto/update-premises.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Premises } from './entities/premises.entity';
import { DataSource, IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { Accounts } from 'src/accounts/entities/account.entity';

@Injectable()
export class PremisesService {
  constructor(
    @InjectRepository(Premises)
    private readonly premisesRepository: Repository<Premises>,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPremisesDto: CreatePremisesDto) {
    const result = await this.premisesRepository.save({
      name: createPremisesDto.name,
      address: createPremisesDto.address,
      phone: createPremisesDto.phone,
      slug: createPremisesDto.slug,
    });
    if (!result) {
      throw new Error();
    }
    return {
      message: 'Tạo cơ sở thành công!',
    };
  }

  async findAll(thisRatingRole: number) {
    const result = await this.premisesRepository.find({
      relations: {
        manage: {
          roles: true,
        },
        staff: {
          roles: true,
        },
      },
      where: [
        {
          manage: {
            roles: {
              rating: MoreThan(thisRatingRole),
            },
          },
        },
        {
          staff: {
            roles: {
              rating: MoreThan(thisRatingRole),
            },
          },
        },
      ],
    });

    if (!result) {
      throw new Error();
    }

    return result;
  }

  async findOne(id: number, thisRatingRole: number) {
    try {
      const result = await this.premisesRepository.findOne({
        relations: {
          manage: {
            roles: true,
          },
          staff: {
            roles: true,
          },
        },
        where: [
          {
            id,
            manage: {
              roles: {
                rating: MoreThan(thisRatingRole),
              },
            },
          },
          {
            id,
            staff: {
              roles: {
                rating: MoreThan(thisRatingRole),
              },
            },
          },
        ],
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          staff: {
            id: false,
          },
          manage: {
            id: false,
          },
        },
      });
      return result;
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }

  async update(id: number, updatePremisesDto: UpdatePremisesDto) {
    const result = await this.premisesRepository.update(id, updatePremisesDto);
    if (!result.affected) {
      throw new Error();
    }
    return {
      message: 'Cập nhật cơ sở thành công!',
    };
  }

  async remove(id: number) {
    const result = await this.premisesRepository.delete(id);
    if (!result.affected) {
      throw new Error();
    }
    return {
      message: 'Xóa cơ sở thành công.',
    };
  }

  async handleDeleteRolePremises(id: string, thisRole: number) {
    const account = await this.accountsRepository.findOne({
      relations: {
        roles: true,
      },
      where: {
        id: id,
        roles: {
          rating: MoreThan(thisRole),
        },
      },
    });
    if (!account) {
      throw new Error();
    }
    await this.accountsRepository.save({ ...account, premise: null, premises: null });
    return {
      message: 'Xóa quyền tài khoản thành công!',
    };
  }

  async hanldeDetailPremises(id: number) {
    const result = await this.premisesRepository.findOne({
      relations: {
        manage: true,
        staff: true,
      },
      where: {
        id: id,
        manage: {
          premise: null,
        },
        staff: {
          premises: null,
        },
      },
      select: ['id', 'name', 'address', 'phone', 'slug'],
    });

    if (!result.manage && result.staff.length >= 0) {
      return ['Manage', 'Staff'];
    } else if (result.manage) {
      return ['Staff'];
    } else {
      throw new Error();
    }
  }

  async handleGetAccountsRoles() {
    return await this.accountsRepository.find({
      relations: {
        roles: true,
      },
      where: {
        premise: IsNull(),
        premises: IsNull(),
        ban: false,
        roles: IsNull(),
      },
    });
  }

  async handleUpdateRoleAccount(data: { id: string; role?: any; roles?: any }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await this.accountsRepository.findOne({
        relations: {
          roles: true,
        },
        where: {
          id: data.id,
          ban: false,
          premise: IsNull(),
          roles: IsNull(),
        },
      });
      if (!account) {
        throw new Error();
      }
      if (data.role) {
        const isExits = await this.premisesRepository.findOne({ where: { id: data.role } });
        if (!isExits) {
          throw new Error();
        }

        await queryRunner.manager.update(
          Accounts,
          { id: data.id },
          {
            roles: {
              id: 2,
            },
            premise: data.role,
            premises: null,
          },
        );
        queryRunner.commitTransaction();
        return {
          message: 'Cập nhật quyền tài khoản thành công!',
        };
      }
      if (data.roles) {
        const isExits = await this.premisesRepository.findOne({ where: { id: data.roles } });
        if (!isExits) {
          throw new Error();
        }

        await queryRunner.manager.update(
          Accounts,
          { id: data.id },
          {
            roles: {
              id: 3,
            },
            premises: data.roles,
            premise: null,
          },
        );
        await queryRunner.commitTransaction();
        return {
          message: 'Cập nhật quyền tài khoản thành công!',
        };
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new Error();
    } finally {
      await queryRunner.release();
    }
  }

  async handleGetTotalPersonnel() {
    return await this.premisesRepository.findAndCount({ relations: { manage: true, staff: true }, select: ['manage', 'staff'] });
  }

  async handleGetProductsPermise(id: number) {
    try {
      return await this.premisesRepository.find({
        relations: {
          products: true,
        },
        where: {
          id: id,
        },
      });
    } catch (e) {
      throw new HttpException(e.errMgs || 'Có lỗi xảy ra xin vui lòng thử lại sau.', e.status || 404);
    }
  }
}
