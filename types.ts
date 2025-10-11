
export type ViewType = 'dashboard' | 'mock-test' | 'chatbot' | 'planner' | 'community' | 'settings';

export interface User {
    name: string;
    avatarUrl: string;
}

export interface ProgressData {
    month: string;
    Toán: number;
    'Ngữ văn': number;
    'Tiếng Anh': number;
}

export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface MockTestResult {
    score: number;
    total: number;
    answers: { question: Question; userAnswer: string }[];
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}
