export type ViewType = 'dashboard' | 'mock-test' | 'chatbot' | 'planner' | 'community' | 'knowledge-base';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface MockQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  userAnswer?: string;
}

export interface ProgressData {
  name: string;
  'Điểm': number;
}
