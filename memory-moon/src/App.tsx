import React, { useState, useEffect } from 'react';
import './App.css';
import StarField from './components/StarField/StarField';
import MoonScene from './components/MoonScene/MoonScene';
import TopBar from './components/TopBar/TopBar';
import Timeline from './components/Timeline/Timeline';
import MemoryCard from './components/MemoryCard/MemoryCard';
import AddMemoryModal from './components/AddMemoryModal/AddMemoryModal';
import EditMemoryModal from './components/EditMemoryModal/EditMemoryModal';
import PetProfile from './components/PetProfile/PetProfile';
import AICompanion from './components/AICompanion/AICompanion';
import { useStore } from './store/useStore';
import type { Memory } from './types';

type ViewType = 'space' | 'profile' | 'ai';

const App: React.FC = () => {
    const { pet, memories, selectedMemoryId, selectMemory, cycleTheme, togglePlanetStyle, deleteMemory } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
    const [currentView, setCurrentView] = useState<ViewType>('space');
    const [isTopBarNear, setIsTopBarNear] = useState(false);
    const [isTopBarHovered, setIsTopBarHovered] = useState(false);
    const [isMusicOpen, setIsMusicOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);

    const selectedMemory = memories.find(m => m.id === selectedMemoryId) ?? null;

    // Detect mobile/tablet
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mouse proximity detector for TopBar
    useEffect(() => {
        if (isMobile) return;

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
    }, [currentView, isMobile]);

    // Auto-hide music bubble after 8s of no hover
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isMusicOpen && !isTopBarHovered) {
            timer = setTimeout(() => {
                setIsMusicOpen(false);
            }, 3000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isMusicOpen, isTopBarHovered]);

    const renderMainContent = () => {
        switch (currentView) {
            case 'profile':
                return <PetProfile />;
            case 'ai':
                return <AICompanion />;
            default:
                return (
                    <>
                        <div className={`side-panel side-panel--left ${showLeftPanel ? '' : 'side-panel--hidden'}`}>
                            <Timeline
                                petName={pet.name}
                                memories={memories}
                                selectedId={selectedMemoryId}
                                onSelect={selectMemory}
                                onAddClick={() => setIsModalOpen(true)}
                            />
                            <button
                                className={`panel-toggle panel-toggle--left ${showLeftPanel ? '' : 'panel-toggle--collapsed'}`}
                                onClick={() => setShowLeftPanel(!showLeftPanel)}
                                aria-label="Toggle Timeline"
                            >
                                {showLeftPanel ? '←' : '→'}
                            </button>
                        </div>
                        <div className={`side-panel side-panel--right ${showRightPanel ? '' : 'side-panel--hidden'}`}>
                            <MemoryCard
                                memory={selectedMemory}
                                onEdit={setEditingMemory}
                                onDelete={deleteMemory}
                            />
                            <button
                                key={`toggle-right-${selectedMemoryId}`}
                                className={`panel-toggle panel-toggle--right ${showRightPanel ? '' : 'panel-toggle--collapsed'}`}
                                onClick={() => setShowRightPanel(!showRightPanel)}
                                aria-label="Toggle Memory Card"
                            >
                                {showRightPanel ? '→' : '←'}
                            </button>
                        </div>
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
                    isVisible={isMobile || currentView !== 'space' || isTopBarNear || isMusicOpen || isTopBarHovered}
                    isMusicOpen={isMusicOpen}
                    onMusicToggle={setIsMusicOpen}
                    onHoverChange={setIsTopBarHovered}
                    onSpace={() => setCurrentView('space')}
                    onPetProfile={() => setCurrentView(currentView === 'profile' ? 'space' : 'profile')}
                    onAI={() => setCurrentView(currentView === 'ai' ? 'space' : 'ai')}
                    onSettings={cycleTheme}
                    onTogglePlanetStyle={togglePlanetStyle}
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

            <EditMemoryModal
                memory={editingMemory}
                isOpen={!!editingMemory}
                onClose={() => setEditingMemory(null)}
            />
        </div>
    );
};

export default App;
