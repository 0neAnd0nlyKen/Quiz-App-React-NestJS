import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';

export enum sessionStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
}

@Entity('user_quiz_sessions')
@Unique(['userId', 'quizId'])
export class UserQuizSessions {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'int', name: 'user_id' })
    userId: number;

    @Column({ type: 'int', name: 'quiz_id' })
    quizId: number;

    @Column({ type: 'int', name: 'seconds_remaining' })
    secondsRemaining: number;
    
    @Column({ type: 'int', name: 'current_question_index' })
    currentQuestionIndex: number;

    @Column({ type: 'int', name: 'score' })
    score: number;
    
    //enum status completed, in_progress, pending
    @Column({ type: 'varchar', name: 'status', length: 20 })
    status: sessionStatus;

    //column named 'updated_at' data type timestamptz
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Quiz, (quiz) => quiz.userQuizSessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'quiz_id' })
    quiz: Quiz;
}
