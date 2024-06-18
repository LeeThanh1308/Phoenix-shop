import { Test, TestingModule } from '@nestjs/testing';
import { ProductsPremiseService } from './products_premise.service';

describe('ProductsPremiseService', () => {
  let service: ProductsPremiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsPremiseService],
    }).compile();

    service = module.get<ProductsPremiseService>(ProductsPremiseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
