import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Accounts } from 'src/accounts/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Accounts]), JwtModule],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
