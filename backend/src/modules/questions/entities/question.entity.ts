import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
  
  @Column({ name: 'correct_answer' })
  correctAnswer: boolean;

  //foreign key relation to quiz
  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;
}