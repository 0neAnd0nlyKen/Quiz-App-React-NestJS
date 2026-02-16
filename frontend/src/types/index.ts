export type SessionStatus = 'pending' | 'in_progress' | 'completed';

export interface User {
    id: number;
    email: string;
    username: string;
    role: 'admin' | 'user';
}

export interface Quiz {
    id: number;
    name: string;
    questions?: Question[];
}
export interface Question {
    id: number;
    text: string;
    quiz: Quiz;
}

export interface Session {
    id: number;
    status: SessionStatus;
    secondsRemaining: number;
    currentQuestionIndex: number;
    quiz: Quiz;
}