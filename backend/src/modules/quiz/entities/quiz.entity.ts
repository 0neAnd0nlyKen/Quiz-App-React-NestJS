import { Question } from '../../questions/entities/question.entity';
import { UserQuizSessions } from '../../user-quiz-session/entities/user-quiz-session.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @OneToMany(() => Question, question => question.quiz, { cascade: true })
  questions: Question[];

  @OneToMany(() => UserQuizSessions, userQuizSession => userQuizSession.quiz, { cascade: true })
  userQuizSessions: UserQuizSessions[];
}