import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}