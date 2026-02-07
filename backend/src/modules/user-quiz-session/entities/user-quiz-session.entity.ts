import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, JoinColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Quiz } from 'src/modules/quiz/entities/quiz.entity';


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

    @Column({ type: 'boolean', name: 'is_completed' })
    isCompleted: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'inserted_at' })
    insertedAt: Date;

    @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Quiz, (quiz) => quiz.userQuizSessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'quiz_id' })
    quiz: Quiz;
}
