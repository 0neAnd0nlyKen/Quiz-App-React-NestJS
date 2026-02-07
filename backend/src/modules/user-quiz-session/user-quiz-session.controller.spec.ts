import { Test, TestingModule } from '@nestjs/testing';
import { UserQuizSessionController } from './user-quiz-session.controller';

describe('UserQuizSessionController', () => {
  let controller: UserQuizSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserQuizSessionController],
    }).compile();

    controller = module.get<UserQuizSessionController>(UserQuizSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
