import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  questionId: number;

  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true || value === 'True')
  @IsBoolean()
  userAnswer: boolean;
}
