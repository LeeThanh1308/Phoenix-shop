import { Module } from '@nestjs/common';
import { SoldsService } from './solds.service';
import { SoldsController } from './solds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sold } from './entities/sold.entity';
import { Accounts } from 'src/accounts/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Sold, Accounts]), JwtModule],
  controllers: [SoldsController],
  providers: [SoldsService],
})
export class SoldsModule {}
