import { IsNotEmpty, IsString, MinLength, IsNumber, IsBoolean } from 'class-validator';

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