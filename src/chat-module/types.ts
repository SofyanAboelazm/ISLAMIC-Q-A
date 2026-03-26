export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: any;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  lastMessage?: string;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
}
