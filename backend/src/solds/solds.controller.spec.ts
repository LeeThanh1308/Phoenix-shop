import { Test, TestingModule } from '@nestjs/testing';
import { SoldsController } from './solds.controller';
import { SoldsService } from './solds.service';

describe('SoldsController', () => {
  let controller: SoldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoldsController],
      providers: [SoldsService],
    }).compile();

    controller = module.get<SoldsController>(SoldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
