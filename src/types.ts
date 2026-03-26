export interface Reference {
  source: string;
  book: string;
  reference: string;
  text?: string;
}

export interface SearchResult {
  answer: string;
  dalil: string;
  references: Reference[];
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: any;
}

export type Language = 'ar' | 'en' | 'fr' | 'de' | 'es' | 'id';

export interface SearchHistoryItem {
  id: string;
  query: string;
  answer: string;
  timestamp: any;
  references: Reference[];
  language?: Language;
}
