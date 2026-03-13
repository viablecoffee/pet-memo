import { create } from 'zustand';
import type { Memory, Pet } from '../types';

// Demo data (will be replaced by SQLite later)
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

interface AppState {
  pet: Pet;
  memories: Memory[];
  selectedMemoryId: string | null;
  isPlaying: boolean;
  volume: number;
  selectMemory: (id: string | null) => void;
  addMemory: (m: Memory) => void;
  updateMemory: (m: Memory) => void;
  deleteMemory: (id: string) => void;
  updatePet: (p: Pet) => void;
  setPlaying: (v: boolean) => void;
  setVolume: (v: number) => void;
}

export const useStore = create<AppState>((set) => ({
  pet: DEMO_PET,
  memories: DEMO_MEMORIES,
  selectedMemoryId: '1',
  isPlaying: false,
  volume: 0.7,

  selectMemory: (id) => set({ selectedMemoryId: id }),
  addMemory: (m) => set(s => ({ memories: [...s.memories, m] })),
  updateMemory: (m) => set(s => ({ memories: s.memories.map(x => x.id === m.id ? m : x) })),
  deleteMemory: (id) => set(s => ({ memories: s.memories.filter(x => x.id !== id) })),
  updatePet: (p) => set({ pet: p }),
  setPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => set({ volume: v }),
}));
