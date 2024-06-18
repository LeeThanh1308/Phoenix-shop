import { Test, TestingModule } from '@nestjs/testing';
import { SoldsService } from './solds.service';

describe('SoldsService', () => {
  let service: SoldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoldsService],
    }).compile();

    service = module.get<SoldsService>(SoldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
