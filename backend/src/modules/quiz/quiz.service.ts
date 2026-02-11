import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
  ) {}
  async create(quizData: Partial<Quiz>): Promise<Quiz> {
    const newQuiz = this.quizzesRepository.create(quizData);
    return this.quizzesRepository.save(newQuiz);
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizzesRepository.find();
  }

  async findOne(id: number): Promise<Quiz | null> {
    return this.quizzesRepository.findOne({ where: { id } });
  }
  
  async update(id: number, updateData: Partial<Quiz>): Promise<Quiz> {
    await this.quizzesRepository.update(id, updateData);
    return this.findOne(id) as Promise<Quiz>;
  }
  
  async delete(id: number): Promise<void> {
    await this.quizzesRepository.delete(id);
  }

  async findWithQuestions(id: number): Promise<Quiz | null> {
    return this.quizzesRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
  }

  async search(name: string): Promise<Quiz[]> {
    return this.quizzesRepository
      .createQueryBuilder('quiz')
      .where('quiz.name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async getQuestions(quizId: number): Promise<Question[]> {
    const quiz = await this.findWithQuestions(quizId);
    return quiz?.questions ?? [];
  }

}
