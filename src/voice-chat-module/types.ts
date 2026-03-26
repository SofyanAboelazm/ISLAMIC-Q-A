export interface VoiceChatSession {
  id: string;
  userId: string;
  voiceType: 'male' | 'female';
  title: string;
  createdAt: any;
  updatedAt: any;
}

export interface VoiceChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: any;
}
