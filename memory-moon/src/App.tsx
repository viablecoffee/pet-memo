import React, { useState, useEffect } from 'react';
import './App.css';
import StarField from './components/StarField/StarField';
import MoonScene from './components/MoonScene/MoonScene';
import TopBar from './components/TopBar/TopBar';
import Timeline from './components/Timeline/Timeline';
import MemoryCard from './components/MemoryCard/MemoryCard';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import AddMemoryModal from './components/AddMemoryModal/AddMemoryModal';
import PetProfile from './components/PetProfile/PetProfile';
import { useStore } from './store/useStore';

const App: React.FC = () => {
    const { pet, memories, selectedMemoryId, selectMemory } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPetProfile, setShowPetProfile] = useState(false);
    const [isTopBarNear, setIsTopBarNear] = useState(false);

    const selectedMemory = memories.find(m => m.id === selectedMemoryId) ?? null;

    // Mouse proximity detector for TopBar
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (showPetProfile) return;
            if (e.clientY < 60) {
                setIsTopBarNear(true);
            } else {
                setIsTopBarNear(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [showPetProfile]);

    return (
        <div className={`app ${showPetProfile ? 'app--scrolling' : ''}`}>
            <StarField />
            <MoonScene />
            <div className="app-ui">
                <TopBar 
                    isVisible={showPetProfile || isTopBarNear} 
                    onPetProfile={() => setShowPetProfile(!showPetProfile)}
                    activeView={showPetProfile ? 'profile' : 'space'}
                />
                {showPetProfile ? (
                    <PetProfile />
                ) : (
                    <>
                        <Timeline
                            petName={pet.name}
                            memories={memories}
                            selectedId={selectedMemoryId}
                            onSelect={selectMemory}
                            onAddClick={() => setIsModalOpen(true)}
                        />
                        <MemoryCard memory={selectedMemory} />
                        <MusicPlayer />
                    </>
                )}
            </div>

            <AddMemoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default App;
