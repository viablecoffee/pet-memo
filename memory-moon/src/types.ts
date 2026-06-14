// Shared type definitions
export interface Memory {
  id: string;
  petId: string;
  date: string;      // "YYYY-MM-DD"
  title: string;
  description: string;
  photos: string[];  // base64 or file paths
  emoji?: string;
}

export interface Letter {
  id: string;
  title?: string;
  message: string;
  createdDate: string; // "YYYY-MM-DD"
  openDate: string;    // "YYYY-MM-DD" — sealed until this day
  opened?: boolean;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  birthDate?: string;
  passDate?: string;
  avatarUrl?: string;
  gender?: string;
  breed?: string;
  weight?: string;
  color?: string;
  hobbies?: string;
  favoriteFood?: string;
  letters?: Letter[];
  aiChatHistory?: { role: 'user' | 'model'; text: string }[];
  aiInsights?: { label: string; text: string }[];
  lastInsightUpdate?: string | null;
}

export interface Track {
  id: string;
  name: string;
  url: string;
}
