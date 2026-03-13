import React, { useState } from 'react';
import './App.css';
import StarField from './components/StarField/StarField';
import MoonScene from './components/MoonScene/MoonScene';
import TopBar from './components/TopBar/TopBar';
import Timeline from './components/Timeline/Timeline';
import MemoryCard from './components/MemoryCard/MemoryCard';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import AddMemoryModal from './components/AddMemoryModal/AddMemoryModal';
import { useStore } from './store/useStore';

const App: React.FC = () => {
    const { pet, memories, selectedMemoryId, selectMemory } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const selectedMemory = memories.find(m => m.id === selectedMemoryId) ?? null;

    return (
        <div className="app">
            {/* Layer 0: particle star field background */}
            <StarField />

            {/* Layer 1: 3D moon scene */}
            <MoonScene />

            {/* Layer 2: UI overlay */}
            <div className="app-ui">
                <TopBar />
                <Timeline
                    petName={pet.name}
                    memories={memories}
                    selectedId={selectedMemoryId}
                    onSelect={selectMemory}
                    onAddClick={() => setIsModalOpen(true)}
                />
                <MemoryCard memory={selectedMemory} />
                <MusicPlayer />
            </div>

            <AddMemoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default App;
