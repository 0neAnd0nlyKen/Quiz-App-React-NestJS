import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsBoolean()
  correctAnswer: boolean;

  @IsNotEmpty()
  @IsNumber()
  quizId: number;
}
