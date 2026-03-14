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
  { id: '1', petId: '1', date: '2018-06-12', title: 'Adoption Day', description: 'The day we met you for the first time. You wagged your tail and ran straight into my arms. From that moment, you became my whole world.', photos: ['/assets/images/adoption_day.jpg'], emoji: '🐾' },
  { id: '2', petId: '1', date: '2019-03-20', title: 'First Walk', description: 'Your first walk at the park. You were so excited, sniffing everything in sight.', photos: ['/assets/images/first_walk.jpg'], emoji: '🦮' },
  { id: '3', petId: '1', date: '2020-07-04', title: 'Beach Trip', description: 'A sunny beach day. You loved chasing waves and digging in the sand.', photos: ['/assets/images/beach_trip.jpg'], emoji: '✈️' },
  { id: '4', petId: '1', date: '2021-06-12', title: 'Birthday', description: 'Your 3rd birthday. We baked you a special dog-friendly cake!', photos: ['/assets/images/birthday.jpg'], emoji: '🎂' },
  { id: '5', petId: '1', date: '2022-01-10', title: 'Snow Day', description: 'Your first time seeing snow. You leaped and rolled in it for hours.', photos: ['/assets/images/snow_day.jpg'], emoji: '❄️' },
  { id: '6', petId: '1', date: '2023-08-15', title: 'Happy Summer', description: 'A wonderful trip to the lake together. The sunset was beautiful, and you couldn\'t stop swimming.', photos: ['/assets/images/happy_summer.jpg'], emoji: '☀️' },
  { id: '7', petId: '1', date: '2024-02-28', title: 'Our Story Goes On', description: 'Every day with you is a new adventure. Thank you for bringing so much joy into my life, Milo.', photos: ['/assets/images/our_story_goes_on.jpg'], emoji: '🌙' },
];

const DEMO_PETS: Pet[] = [DEMO_PET];

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
  pets: Pet[];
  currentPetId: string;
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
  isTransitioning: boolean;
  tracks: Track[];
  currentTrackId: string;
  loopMode: LoopMode;
  selectMemory: (id: string | null) => void;
  addMemory: (m: Memory) => void;
  updateMemory: (m: Memory) => void;
  deleteMemory: (id: string) => void;
  updatePet: (p: Pet) => void;
  addPet: (p: Pet) => void;
  deletePet: (id: string) => void;
  setCurrentPet: (id: string) => Promise<void>;
  setTransitioning: (v: boolean) => void;
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

const savePetsToIDB = async (pets: Pet[]) => {
  try {
    // We store multiple pets in 'pet' store by ID
    for (const pet of pets) {
      await idb.put('pet', pet);
    }
  } catch (error) {
    console.error('Failed to save pets to IndexedDB:', error);
  }
};

const saveMemoriesToIDB = async (memories: Memory[]) => {
  try {
    for (const memory of memories) {
      await idb.put('memories', memory);
    }
  } catch (error) {
    console.error('Failed to save memories to IndexedDB:', error);
  }
};

export const useStore = create<AppState>((set) => ({
  pets: DEMO_PETS,
  currentPetId: '1',
  pet: DEMO_PET,
  memories: DEMO_MEMORIES,
  selectedMemoryId: '1',
  isPlaying: true, // Default to true for auto-play
  volume: parseFloat(localStorage.getItem('app_volume') || '0.7'),
  apiKey: localStorage.getItem('gemini_api_key') || '',
  aiModel: localStorage.getItem('gemini_ai_model') || 'gemini-1.5-flash',
  theme: (localStorage.getItem('app_theme') as ThemeType) || 'night',
  planetStyle: (localStorage.getItem('planet_style') as any) || 'minimal',
  aiInsights: [],
  lastInsightUpdate: null,
  chatHistory: [],
  isLoaded: false,
  isTransitioning: false,
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
    set(s => ({
      pet: p,
      pets: s.pets.map(item => item.id === p.id ? p : item)
    }));
  },

  addPet: (p) => set(s => {
    if (s.pets.length >= 6) return s;
    const petWithAvatar = { ...p, avatarUrl: p.avatarUrl || '/assets/images/milo_avatar.jpg' };
    const newPets = [...s.pets, petWithAvatar];
    savePetToIDB(petWithAvatar);
    localStorage.setItem('current_pet_id', p.id);
    return {
      pets: newPets,
      currentPetId: p.id,
      pet: petWithAvatar,
      memories: [],
      selectedMemoryId: null
    };
  }),

  deletePet: (id) => set(s => {
    if (s.pets.length <= 1) return s;
    const newPets = s.pets.filter(p => p.id !== id);
    idb.delete('pet', id);

    // Also cleanup memories for this pet in IDB
    // (Actual deletion logic should be more thorough but this is okay for now)

    let nextPetId = s.currentPetId;
    if (id === s.currentPetId) {
      nextPetId = newPets[0].id;
      localStorage.setItem('current_pet_id', nextPetId);
    }

    const nextPet = newPets.find(p => p.id === nextPetId) || newPets[0];

    return {
      pets: newPets,
      currentPetId: nextPet.id,
      pet: nextPet,
      memories: id === s.currentPetId ? [] : s.memories,
      selectedMemoryId: id === s.currentPetId ? null : s.selectedMemoryId
    };
  }),

  setCurrentPet: async (id) => {
    const s = useStore.getState();
    const targetPet = s.pets.find(p => p.id === id);
    if (!targetPet || id === s.currentPetId) return;

    set({ isTransitioning: true });

    // Wait for fade in
    await new Promise(r => setTimeout(r, 600));

    localStorage.setItem('current_pet_id', id);

    try {
      const allMemories = await idb.getAll<Memory>('memories');
      const filteredMemories = allMemories.filter(m => m.petId === id);

      set({
        currentPetId: id,
        pet: targetPet,
        memories: filteredMemories.length > 0 ? filteredMemories : (id === '1' ? DEMO_MEMORIES : []),
        selectedMemoryId: filteredMemories.length > 0 ? filteredMemories[0].id : (id === '1' && DEMO_MEMORIES.length > 0 ? DEMO_MEMORIES[0].id : null),
        aiInsights: targetPet.aiInsights || [],
        lastInsightUpdate: targetPet.lastInsightUpdate || null,
        chatHistory: targetPet.aiChatHistory || []
      });
    } catch (e) {
      set({
        currentPetId: id,
        pet: targetPet,
        memories: [],
        selectedMemoryId: null,
        aiInsights: targetPet.aiInsights || [],
        lastInsightUpdate: targetPet.lastInsightUpdate || null,
        chatHistory: targetPet.aiChatHistory || []
      });
    }

    // Buffer
    await new Promise(r => setTimeout(r, 400));
    set({ isTransitioning: false });
  },

  setTransitioning: (v) => set({ isTransitioning: v }),

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

  setAiInsights: (insights, date) => set(s => {
    const updatedPet = { ...s.pet, aiInsights: insights, lastInsightUpdate: date };
    savePetToIDB(updatedPet);
    return {
      aiInsights: insights,
      lastInsightUpdate: date,
      pet: updatedPet,
      pets: s.pets.map(p => p.id === updatedPet.id ? updatedPet : p)
    };
  }),

  addChatMessage: (msg) => set(s => {
    const newHistory = [...s.chatHistory, msg];
    const updatedPet = { ...s.pet, aiChatHistory: newHistory };
    savePetToIDB(updatedPet);
    return {
      chatHistory: newHistory,
      pet: updatedPet,
      pets: s.pets.map(p => p.id === updatedPet.id ? updatedPet : p)
    };
  }),

  clearChatHistory: () => set(s => {
    const updatedPet = { ...s.pet, aiChatHistory: [] };
    savePetToIDB(updatedPet);
    return {
      chatHistory: [],
      pet: updatedPet,
      pets: s.pets.map(p => p.id === updatedPet.id ? updatedPet : p)
    };
  }),
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
    const [pets, allMemories] = await Promise.all([
      idb.getAll<Pet>('pet'),
      idb.getAll<Memory>('memories'),
    ]);

    const savedCurrentPetId = localStorage.getItem('current_pet_id') || '1';

    if (pets.length > 0) {
      const currentPet = pets.find(p => p.id === savedCurrentPetId) || pets[0];
      const filteredMemories = allMemories.filter(m => m.petId === currentPet.id);

      useStore.setState({
        pets,
        currentPetId: currentPet.id,
        pet: currentPet,
        memories: filteredMemories.length > 0 ? filteredMemories : (currentPet.id === '1' ? DEMO_MEMORIES : []),
        selectedMemoryId: filteredMemories.length > 0 ? filteredMemories[0].id : (currentPet.id === '1' && DEMO_MEMORIES.length > 0 ? DEMO_MEMORIES[0].id : null),
        aiInsights: currentPet.aiInsights || [],
        lastInsightUpdate: currentPet.lastInsightUpdate || null,
        chatHistory: currentPet.aiChatHistory || [],
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
