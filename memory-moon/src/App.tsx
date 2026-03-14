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
import AICompanion from './components/AICompanion/AICompanion';
import { useStore } from './store/useStore';

type ViewType = 'space' | 'profile' | 'ai';

const App: React.FC = () => {
    const { pet, memories, selectedMemoryId, selectMemory } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('space');
    const [isTopBarNear, setIsTopBarNear] = useState(false);

    const selectedMemory = memories.find(m => m.id === selectedMemoryId) ?? null;

    // Mouse proximity detector for TopBar
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (currentView !== 'space') return;
            if (e.clientY < 60) {
                setIsTopBarNear(true);
            } else {
                setIsTopBarNear(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [currentView]);

    const renderMainContent = () => {
        switch (currentView) {
            case 'profile':
                return <PetProfile />;
            case 'ai':
                return <AICompanion />;
            default:
                return (
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
                );
        }
    };

    return (
        <div className={`app ${currentView !== 'space' ? 'app--scrolling' : ''}`}>
            <StarField />
            <MoonScene />
            <div className="app-ui">
                <TopBar 
                    isVisible={currentView !== 'space' || isTopBarNear} 
                    onSpace={() => setCurrentView('space')}
                    onPetProfile={() => setCurrentView(currentView === 'profile' ? 'space' : 'profile')}
                    onAI={() => setCurrentView(currentView === 'ai' ? 'space' : 'ai')}
                    activeView={currentView}
                    petAvatar={pet.avatarUrl}
                    petName={pet.name}
                />
                {renderMainContent()}
            </div>

            <AddMemoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default App;
