import { Module } from '@nestjs/common';
import { ProductsPremiseService } from './products_premise.service';
import { ProductsPremiseController } from './products_premise.controller';

@Module({
  controllers: [ProductsPremiseController],
  providers: [ProductsPremiseService],
})
export class ProductsPremiseModule {}
