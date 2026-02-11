import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('answers')
@Unique(['userId', 'questionId'])
export class Answer {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'int', name: 'user_id' })
    userId: number;

    @Column({ type: 'int', name: 'question_id' })
    questionId: number;

    @Column({ type: 'boolean', name: 'user_answer' })
    userAnswer: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'inserted_at' })
    insertedAt: Date;

    @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_id' })
    question: Question;
}
