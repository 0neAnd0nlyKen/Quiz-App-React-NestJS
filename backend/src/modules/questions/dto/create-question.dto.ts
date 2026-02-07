import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateQuestionDto {
    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @Transform(({ value }) => value === 'true' || value === true || value === 'True')  
    @IsBoolean()
    correctAnswer: boolean;

    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    quizId: number;
}
