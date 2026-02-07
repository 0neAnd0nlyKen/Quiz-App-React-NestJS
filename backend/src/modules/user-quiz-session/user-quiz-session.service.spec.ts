import { Test, TestingModule } from '@nestjs/testing';
import { UserQuizSessionService } from './user-quiz-session.service';

describe('UserQuizSessionService', () => {
  let service: UserQuizSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQuizSessionService],
    }).compile();

    service = module.get<UserQuizSessionService>(UserQuizSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
