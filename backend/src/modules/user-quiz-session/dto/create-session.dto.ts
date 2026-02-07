import { IsInt } from 'class-validator';

export class CreateSessionDto {
  @IsInt()
  quizId: number;
}
