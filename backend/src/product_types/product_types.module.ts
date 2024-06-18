import { Module } from '@nestjs/common';
import { ProductTypesService } from './product_types.service';
import { ProductTypesController } from './product_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities/product_type.entity';
import { Accounts } from 'src/accounts/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType, Accounts]), JwtModule],
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
})
export class ProductTypesModule {}
