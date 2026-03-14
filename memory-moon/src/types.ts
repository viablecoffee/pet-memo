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
}

export interface Track {
  id: string;
  name: string;
  url: string;
}
