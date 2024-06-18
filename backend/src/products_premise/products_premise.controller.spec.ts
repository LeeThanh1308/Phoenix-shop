import { Test, TestingModule } from '@nestjs/testing';
import { ProductsPremiseController } from './products_premise.controller';
import { ProductsPremiseService } from './products_premise.service';

describe('ProductsPremiseController', () => {
  let controller: ProductsPremiseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsPremiseController],
      providers: [ProductsPremiseService],
    }).compile();

    controller = module.get<ProductsPremiseController>(ProductsPremiseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
