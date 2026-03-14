import { create } from 'zustand';
import type { Memory, Pet } from '../types';

const STORAGE_KEYS = {
  pet: 'pet_data',
  memories: 'memories_data',
} as const;

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const DEMO_PET: Pet = {
  id: '1',
  name: 'Milo',
  species: 'dog',
  gender: 'male',
  breed: 'Golden Retriever',
  birthDate: '2018-06-12',
  color: 'Golden',
  weight: '25 kg',
};

const DEMO_MEMORIES: Memory[] = [
  { id: '1', petId: '1', date: '2018-06-12', title: 'Adoption Day', description: 'The day we met you for the first time. You wagged your tail and ran straight into my arms. From that moment, you became my whole world.', photos: [], emoji: '🐾' },
  { id: '2', petId: '1', date: '2019-03-20', title: 'First Walk', description: 'Your first walk at the park. You were so excited, sniffing everything in sight.', photos: [], emoji: '🦮' },
  { id: '3', petId: '1', date: '2020-07-04', title: 'Beach Trip', description: 'A sunny beach day. You loved chasing waves and digging in the sand.', photos: [], emoji: '✈️' },
  { id: '4', petId: '1', date: '2021-06-12', title: 'Birthday', description: 'Your 3rd birthday. We baked you a special dog-friendly cake!', photos: [], emoji: '🎂' },
  { id: '5', petId: '1', date: '2022-01-10', title: 'Snow Day', description: 'Your first time seeing snow. You leaped and rolled in it for hours.', photos: [], emoji: '❄️' },
  { id: '6', petId: '1', date: '2023-08-15', title: 'Last Summer', description: 'Our last trip to the lake together. The sunset was beautiful.', photos: [], emoji: '☀️' },
  { id: '7', petId: '1', date: '2024-02-28', title: 'Final Moments', description: 'You were tired, but your eyes still held so much love. Thank you for everything, Milo.', photos: [], emoji: '🌙' },
];

export type ThemeType = 'night' | 'sunset' | 'dawn';

interface AppState {
  pet: Pet;
  memories: Memory[];
  selectedMemoryId: string | null;
  isPlaying: boolean;
  volume: number;
  apiKey: string;
  aiModel: string;
  theme: ThemeType;
  planetStyle: 'minimal' | 'artistic' | 'blue';
  aiInsights: { label: string; text: string }[];
  lastInsightUpdate: string | null;
  chatHistory: { role: 'user' | 'model'; text: string }[];
  selectMemory: (id: string | null) => void;
  addMemory: (m: Memory) => void;
  updateMemory: (m: Memory) => void;
  deleteMemory: (id: string) => void;
  updatePet: (p: Pet) => void;
  setPlaying: (v: boolean) => void;
  setVolume: (v: number) => void;
  setApiKey: (key: string) => void;
  setAiModel: (model: string) => void;
  cycleTheme: () => void;
  togglePlanetStyle: () => void;
  setAiInsights: (insights: { label: string; text: string }[], date: string) => void;
  addChatMessage: (msg: { role: 'user' | 'model'; text: string }) => void;
  clearChatHistory: () => void;
}

export const useStore = create<AppState>((set) => ({
  pet: loadFromStorage<Pet>(STORAGE_KEYS.pet, DEMO_PET),
  memories: loadFromStorage<Memory[]>(STORAGE_KEYS.memories, DEMO_MEMORIES),
  selectedMemoryId: '1',
  isPlaying: false,
  volume: 0.7,
  apiKey: localStorage.getItem('gemini_api_key') || '',
  aiModel: localStorage.getItem('gemini_ai_model') || 'gemini-1.5-flash',
  theme: (localStorage.getItem('app_theme') as ThemeType) || 'night',
  planetStyle: (localStorage.getItem('planet_style') as any) || 'minimal',
  aiInsights: JSON.parse(localStorage.getItem('ai_insights') || '[]'),
  lastInsightUpdate: localStorage.getItem('last_insight_update'),
  chatHistory: JSON.parse(localStorage.getItem('ai_chat_history') || '[]'),

  selectMemory: (id) => set({ selectedMemoryId: id }),
  addMemory: (m) => set(s => {
    const newMemories = [...s.memories, m];
    localStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(newMemories));
    return { memories: newMemories };
  }),
  updateMemory: (m) => set(s => {
    const newMemories = s.memories.map(x => x.id === m.id ? m : x);
    localStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(newMemories));
    return { memories: newMemories };
  }),
  deleteMemory: (id) => set(s => {
    const newMemories = s.memories.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.memories, JSON.stringify(newMemories));
    return { memories: newMemories };
  }),
  updatePet: (p) => {
    localStorage.setItem(STORAGE_KEYS.pet, JSON.stringify(p));
    set({ pet: p });
  },
  setPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => set({ volume: v }),
  setApiKey: (key) => {
    localStorage.setItem('gemini_api_key', key);
    set({ apiKey: key });
  },
  setAiModel: (model: string) => {
    localStorage.setItem('gemini_ai_model', model);
    set({ aiModel: model });
  },
  cycleTheme: () => set(s => {
    const themes: ThemeType[] = ['night', 'sunset', 'dawn'];
    const currentIndex = themes.indexOf(s.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    localStorage.setItem('app_theme', nextTheme);
    return { theme: nextTheme };
  }),
  togglePlanetStyle: () => set(s => {
    const styles: ('minimal' | 'artistic' | 'blue')[] = ['minimal', 'artistic', 'blue'];
    const currentIndex = styles.indexOf(s.planetStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    localStorage.setItem('planet_style', nextStyle);
    return { planetStyle: nextStyle };
  }),
  setAiInsights: (insights, date) => {
    localStorage.setItem('ai_insights', JSON.stringify(insights));
    localStorage.setItem('last_insight_update', date);
    set({ aiInsights: insights, lastInsightUpdate: date });
  },
  addChatMessage: (msg) => set(s => {
    const newHistory = [...s.chatHistory, msg];
    localStorage.setItem('ai_chat_history', JSON.stringify(newHistory));
    return { chatHistory: newHistory };
  }),
  clearChatHistory: () => {
    localStorage.removeItem('ai_chat_history');
    set({ chatHistory: [] });
  },
}));
