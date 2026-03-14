import { create } from 'zustand';
import type { Memory, Pet, Track } from '../types';
import idb from './idb';

const DEMO_PET: Pet = {
  id: '1',
  name: 'Milo',
  species: 'dog',
  gender: 'male',
  breed: 'Golden Retriever',
  birthDate: '2018-06-12',
  color: 'Golden',
  weight: '25 kg',
  hobbies: 'Running, Swimming, Chasing balls',
  favoriteFood: 'Beef jerky, Chicken breast, Apples',
  avatarUrl: '/assets/images/milo_avatar.jpg',
};

const DEMO_MEMORIES: Memory[] = [
  { id: '1', petId: '1', date: '2018-06-12', title: 'Adoption Day', description: 'The day we met you for the first time. You wagged your tail and ran straight into my arms. From that moment, you became my whole world.', photos: [], emoji: '🐾' },
  { id: '2', petId: '1', date: '2019-03-20', title: 'First Walk', description: 'Your first walk at the park. You were so excited, sniffing everything in sight.', photos: [], emoji: '🦮' },
  { id: '3', petId: '1', date: '2020-07-04', title: 'Beach Trip', description: 'A sunny beach day. You loved chasing waves and digging in the sand.', photos: [], emoji: '✈️' },
  { id: '4', petId: '1', date: '2021-06-12', title: 'Birthday', description: 'Your 3rd birthday. We baked you a special dog-friendly cake!', photos: [], emoji: '🎂' },
  { id: '5', petId: '1', date: '2022-01-10', title: 'Snow Day', description: 'Your first time seeing snow. You leaped and rolled in it for hours.', photos: [], emoji: '❄️' },
  { id: '6', petId: '1', date: '2023-08-15', title: 'Happy Summer', description: 'A wonderful trip to the lake together. The sunset was beautiful, and you couldn\'t stop swimming.', photos: [], emoji: '☀️' },
  { id: '7', petId: '1', date: '2024-02-28', title: 'Our Story Goes On', description: 'Every day with you is a new adventure. Thank you for bringing so much joy into my life, Milo.', photos: [], emoji: '🌙' },
];

const DEMO_TRACKS: Track[] = [
  { id: '1', name: 'White Noise from Nature', url: '/assets/audio/white_noise_from_nature.mp3' },
  { id: '2', name: 'A New Day with Hope', url: '/assets/audio/A New Day with Hope.mp3' },
  { id: '3', name: 'Faraway Solicitude', url: '/assets/audio/Faraway Solicitude.mp3' },
  { id: '4', name: "Zora's Domain (Night)", url: '/assets/audio/Zora\'s Domain.mp3' },
  { id: '5', name: 'Fragment of Thought', url: '/assets/audio/Fragment of Thought.mp3' },
  { id: '6', name: 'Kryust', url: '/assets/audio/Kryust.mp3' },
];

export type ThemeType = 'night' | 'sunset' | 'dawn';
export type LoopMode = 'single' | 'list' | 'random';

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
  isLoaded: boolean;
  tracks: Track[];
  currentTrackId: string;
  loopMode: LoopMode;
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
  setCurrentTrack: (id: string) => void;
  setLoopMode: (mode: LoopMode) => void;
  nextTrack: () => void;
}

const savePetToIDB = async (pet: Pet) => {
  try {
    await idb.put('pet', pet);
  } catch (error) {
    console.error('Failed to save pet to IndexedDB:', error);
  }
};

const saveMemoriesToIDB = async (memories: Memory[]) => {
  try {
    await idb.clear('memories');
    for (const memory of memories) {
      await idb.put('memories', memory);
    }
  } catch (error) {
    console.error('Failed to save memories to IndexedDB:', error);
  }
};

export const useStore = create<AppState>((set) => ({
  pet: DEMO_PET,
  memories: DEMO_MEMORIES,
  selectedMemoryId: '1',
  isPlaying: true, // Default to true for auto-play
  volume: parseFloat(localStorage.getItem('app_volume') || '0.7'),
  apiKey: localStorage.getItem('gemini_api_key') || '',
  aiModel: localStorage.getItem('gemini_ai_model') || 'gemini-1.5-flash',
  theme: (localStorage.getItem('app_theme') as ThemeType) || 'night',
  planetStyle: (localStorage.getItem('planet_style') as any) || 'minimal',
  aiInsights: JSON.parse(localStorage.getItem('ai_insights') || '[]'),
  lastInsightUpdate: localStorage.getItem('last_insight_update'),
  chatHistory: JSON.parse(localStorage.getItem('ai_chat_history') || '[]'),
  isLoaded: false,
  tracks: DEMO_TRACKS,
  currentTrackId: localStorage.getItem('current_track_id') || '1',
  loopMode: (localStorage.getItem('app_loop_mode') as LoopMode) || 'list',

  selectMemory: (id) => set({ selectedMemoryId: id }),

  addMemory: (m) => set(s => {
    const newMemories = [...s.memories, m];
    saveMemoriesToIDB(newMemories);
    return { memories: newMemories };
  }),

  updateMemory: (m) => set(s => {
    const newMemories = s.memories.map(x => x.id === m.id ? m : x);
    saveMemoriesToIDB(newMemories);
    return { memories: newMemories };
  }),

  deleteMemory: (id) => set(s => {
    const newMemories = s.memories.filter(x => x.id !== id);
    saveMemoriesToIDB(newMemories);
    return { memories: newMemories };
  }),

  updatePet: (p) => {
    savePetToIDB(p);
    set({ pet: p });
  },

  setPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => {
    localStorage.setItem('app_volume', v.toString());
    set({ volume: v });
  },

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
  setCurrentTrack: (id) => {
    localStorage.setItem('current_track_id', id);
    set({ currentTrackId: id });
  },

  setLoopMode: (mode) => {
    localStorage.setItem('app_loop_mode', mode);
    set({ loopMode: mode });
  },

  nextTrack: () => set(s => {
    const currentIndex = s.tracks.findIndex(t => t.id === s.currentTrackId);
    let nextIndex = 0;

    if (s.loopMode === 'random') {
      nextIndex = Math.floor(Math.random() * s.tracks.length);
      // Ensure we don't pick the same track if more than one track exists
      if (s.tracks.length > 1 && nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % s.tracks.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % s.tracks.length;
    }

    const nextTrackId = s.tracks[nextIndex].id;
    localStorage.setItem('current_track_id', nextTrackId);
    return { currentTrackId: nextTrackId };
  }),
}));

export const initializeStore = async () => {
  try {
    const [pet, memories] = await Promise.all([
      idb.get<Pet>('pet', '1'),
      idb.getAll<Memory>('memories'),
    ]);

    if (pet) {
      useStore.getState().updatePet(pet);
    }

    if (memories.length > 0) {
      useStore.setState({
        memories,
        selectedMemoryId: memories[0].id,
        isLoaded: true
      });
    } else {
      useStore.setState({ isLoaded: true });
    }
  } catch (error) {
    console.error('Failed to load from IndexedDB:', error);
    useStore.setState({ isLoaded: true });
  }
};

initializeStore();
