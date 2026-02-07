import { Question } from 'src/modules/questions/entities/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @OneToMany(() => Question, question => question.quiz, { cascade: true })
  questions: Question[];
}