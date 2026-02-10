import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';

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
export class BatchAnswersDto {
  @IsOptional() // Optional because might submit answers separately
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers?: CreateAnswerDto[];
}