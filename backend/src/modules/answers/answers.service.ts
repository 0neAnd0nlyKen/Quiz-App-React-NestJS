import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { User } from '../users/entities/user.entity';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
  ) {}

  async findAll(): Promise<Answer[]> {
    return this.answersRepository.find({
      relations: ['user', 'question'],
    });
  }

  async findOne(id: number): Promise<Answer | null> {
    return this.answersRepository.findOne({
      where: { id },
      relations: ['user', 'question'],
    });
  }

  async findByUserAndQuestion(userId: number, questionId: number): Promise<Answer | null> {
    return this.answersRepository.findOne({
      where: { userId: userId, questionId: questionId },
      relations: ['user', 'question'],
    });
  }

  async findByUser(userId: number): Promise<Answer[]> {
    return this.answersRepository.find({
      where: { userId: userId },
      relations: ['user', 'question'],
    });
  }

  async create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    // Check if user has already answered this question
    
    const existingAnswer = await this.findByUserAndQuestion(createAnswerDto.userId, createAnswerDto.questionId);

    if (existingAnswer) {
      return this.update(existingAnswer.id, createAnswerDto);
    }

    const answer = this.answersRepository.create({
      userId: createAnswerDto.userId,
      questionId: createAnswerDto.questionId,
      userAnswer: createAnswerDto.userAnswer,
    });

    return this.answersRepository.save(answer);
  }

  async update(id: number, updateData: Partial<CreateAnswerDto>): Promise<Answer> {
    const answer = await this.findOne(id);
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (updateData.userId || updateData.questionId) {
      const checkUserId = updateData.userId ?? answer.userId;
      const checkQuestionId = updateData.questionId ?? answer.questionId;

      const existingAnswer = await this.findByUserAndQuestion(checkUserId, checkQuestionId);

      if (existingAnswer && existingAnswer.id !== id) {
        throw new ConflictException('User has already answered this question');
      }
    }

    await this.answersRepository.update(id, updateData);
    return this.findOne(id) as Promise<Answer>;
  }

  async delete(id: number): Promise<void> {
    const answer = await this.findOne(id);
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    await this.answersRepository.delete(id);
  }
}
