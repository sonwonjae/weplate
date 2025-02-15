import { Test, TestingModule } from '@nestjs/testing';
import { AgreeController } from './agree.controller';
import { AgreeService } from './agree.service';

describe('AgreeController', () => {
  let controller: AgreeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgreeController],
      providers: [AgreeService],
    }).compile();

    controller = module.get<AgreeController>(AgreeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
