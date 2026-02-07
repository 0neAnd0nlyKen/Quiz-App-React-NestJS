import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
    constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    ) {}

    async findAll(): Promise<Question[]> {
        return this.questionsRepository.find();
    }

    async findOne(id: number): Promise<Question | null> {
        return this.questionsRepository.findOne({ where: { id } });
    }

    async create(questionData: Partial<Question>): Promise<Question> {
        const newQuestion = this.questionsRepository.create(questionData);
        return this.questionsRepository.save(newQuestion);
    }

    async update(id: number, updateData: Partial<Question>): Promise<Question> {
        await this.questionsRepository.update(id, updateData);
        return this.findOne(id) as Promise<Question>;
    }

    async delete(id: number): Promise<void> {
        await this.questionsRepository.delete(id);
    }

}
