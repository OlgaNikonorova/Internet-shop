import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsGateway } from './recommendations.gateway';

describe('RecommendationsGateway', () => {
  let gateway: RecommendationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommendationsGateway],
    }).compile();

    gateway = module.get<RecommendationsGateway>(RecommendationsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
