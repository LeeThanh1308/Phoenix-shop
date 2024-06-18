import { Module } from '@nestjs/common';
import { PremisesService } from './premises.service';
import { PremisesController } from './premises.controller';
import { Premises } from './entities/premises.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/accounts/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Premises, Accounts]), JwtModule],
  controllers: [PremisesController],
  providers: [PremisesService],
})
export class PremisesModule {}
