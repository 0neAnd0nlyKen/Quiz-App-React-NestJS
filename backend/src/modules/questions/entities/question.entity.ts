import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import { Answer } from 'src/modules/answers/entities/answer.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

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

  @OneToMany(() => Answer, answer => answer.question, { cascade: true })
  answers: Answer[];
}