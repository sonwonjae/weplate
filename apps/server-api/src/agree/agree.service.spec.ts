import { Test, TestingModule } from '@nestjs/testing';
import { AgreeService } from './agree.service';

describe('AgreeService', () => {
  let service: AgreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgreeService],
    }).compile();

    service = module.get<AgreeService>(AgreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
