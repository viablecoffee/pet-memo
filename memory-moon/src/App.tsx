import React, { useState, useEffect, useRef } from 'react';
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
import AddPetModal from './components/AddPetModal/AddPetModal';
import ToastHost from './components/Toast/ToastHost';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import OnThisDayModal from './components/OnThisDayModal/OnThisDayModal';
import LetterReader from './components/Letters/LetterReader';
import MemorialModal from './components/MemorialModal/MemorialModal';
import TourControl from './components/TourControl/TourControl';
import { useStore } from './store/useStore';
import { getOnThisDay, getDueLetters, todayYMD, isAnniversaryToday } from './utils/anniversary';
import { sortMemoriesByDate } from './utils/memories';
import type { OnThisDayMatch } from './utils/anniversary';
import type { Memory, Letter } from './types';

type ViewType = 'space' | 'profile' | 'ai';

const App: React.FC = () => {
    const { pet, memories, selectedMemoryId, selectMemory, setFocusedMemory, cycleTheme, togglePlanetStyle, deleteMemory, isTransitioning, isLoaded } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
    const [currentView, setCurrentView] = useState<ViewType>('space');
    const [isTopBarNear, setIsTopBarNear] = useState(false);
    const [isTopBarHovered, setIsTopBarHovered] = useState(false);
    const [isMusicOpen, setIsMusicOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
    const [showLeftPanel, setShowLeftPanel] = useState(window.innerWidth > 960);
    const [showRightPanel, setShowRightPanel] = useState(window.innerWidth > 960);
    const [isInitialFade, setIsInitialFade] = useState(true);
    const [showOnThisDay, setShowOnThisDay] = useState(false);
    const [onThisDayMatches, setOnThisDayMatches] = useState<OnThisDayMatch[]>([]);
    const [dueLetter, setDueLetter] = useState<Letter | null>(null);
    const [showLetterReader, setShowLetterReader] = useState(false);
    const [tourActive, setTourActive] = useState(false);
    const [tourIndex, setTourIndex] = useState(0);
    const [showMemorial, setShowMemorial] = useState(false);

    const selectedMemory = memories.find(m => m.id === selectedMemoryId) ?? null;

    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const surfacedRef = useRef(false);

    const handleSelectMemory = (id: string) => {
        if (tourActive) setTourActive(false); // a manual pick ends the tour
        if (selectedMemoryId === id && showRightPanel) {
            setShowRightPanel(false);
            setFocusedMemory(null);
        } else {
            selectMemory(id);
            setShowRightPanel(true);
            setFocusedMemory(id);
        }
    };

    const startTour = () => {
        setCurrentView('space');
        setTourIndex(0);
        setTourActive(true);
    };

    const stopTour = () => {
        setTourActive(false);
        setFocusedMemory(null);
        setShowRightPanel(false);
    };

    // Smart click-outside: collapse panels when clicking outside
    useEffect(() => {
        if (currentView !== 'space') return;

        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as Node;

            // Ignore clicks inside panels or their toggle buttons
            if (leftPanelRef.current?.contains(target)) return;
            if (rightPanelRef.current?.contains(target)) return;

            // Ignore clicks on topbar or modal overlays
            const topbar = document.querySelector('.topbar');
            const modal = document.querySelector('.modal-overlay');
            if (topbar?.contains(target)) return;
            if (modal?.contains(target)) return;

            // Priority collapse: if both are open, close right first
            if (showLeftPanel && showRightPanel) {
                setShowRightPanel(false);
            } else if (showRightPanel) {
                setShowRightPanel(false);
            } else if (showLeftPanel) {
                setShowLeftPanel(false);
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [currentView, showLeftPanel, showRightPanel]);

    // Detect mobile/tablet
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 960);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initial cinematic fade
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialFade(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    // On-load surfacing (once, after the opening fade + data loaded):
    // a due letter takes priority over an "on this day" memory; on-this-day
    // is shown at most once per calendar day.
    useEffect(() => {
        if (isInitialFade || !isLoaded || surfacedRef.current) return;
        surfacedRef.current = true;

        const { pet: curPet, memories: curMemories } = useStore.getState();
        const today = todayYMD();

        // Memorial anniversary — the most significant, surfaced first.
        if (isAnniversaryToday(curPet.passDate) && localStorage.getItem('memorial_shown') !== today) {
            setShowMemorial(true);
            localStorage.setItem('memorial_shown', today);
            return;
        }

        const due = getDueLetters(curPet.letters, today);
        if (due.length > 0) {
            setDueLetter(due[0]);
            setShowLetterReader(true);
            return;
        }

        if (localStorage.getItem('onThisDay_shown') === today) return;
        const matches = getOnThisDay(curMemories);
        if (matches.length > 0) {
            setOnThisDayMatches(matches);
            setShowOnThisDay(true);
            localStorage.setItem('onThisDay_shown', today);
        }
    }, [isInitialFade, isLoaded]);

    // Guided tour: fly the camera through memories chronologically, dwelling on each.
    useEffect(() => {
        if (!tourActive) return;
        const sorted = sortMemoriesByDate(useStore.getState().memories);
        if (sorted.length < 2) { setTourActive(false); return; }
        const current = sorted[tourIndex];
        if (!current) { setTourActive(false); setFocusedMemory(null); return; }
        selectMemory(current.id);
        setFocusedMemory(current.id);
        setShowRightPanel(true);
        const timer = setTimeout(() => {
            if (tourIndex + 1 < sorted.length) {
                setTourIndex(tourIndex + 1);
            } else {
                setTourActive(false);
                setFocusedMemory(null);
                setShowRightPanel(false);
            }
        }, 3200);
        return () => clearTimeout(timer);
    }, [tourActive, tourIndex]);

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
                        <div ref={leftPanelRef} className={`side-panel side-panel--left ${showLeftPanel ? '' : 'side-panel--hidden'}`}>
                            <Timeline
                                petName={pet.name}
                                memories={memories}
                                selectedId={selectedMemoryId}
                                onSelect={handleSelectMemory}
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
                        <div ref={rightPanelRef} className={`side-panel side-panel--right ${showRightPanel ? '' : 'side-panel--hidden'}`}>
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
            <MoonScene onStarClick={handleSelectMemory} playIntro={isInitialFade} />
            <div className="app-ui">
                <TopBar
                    isVisible={isMobile || currentView !== 'space' || isTopBarNear || isMusicOpen || isTopBarHovered}
                    isMusicOpen={isMusicOpen}
                    onMusicToggle={setIsMusicOpen}
                    onHoverChange={setIsTopBarHovered}
                    onSpace={() => {
                        setCurrentView('space');
                        if (window.innerWidth <= 960) {
                            setShowLeftPanel(false);
                            setShowRightPanel(false);
                        }
                    }}
                    onPetProfile={() => setCurrentView(currentView === 'profile' ? 'space' : 'profile')}
                    onAI={() => setCurrentView(currentView === 'ai' ? 'space' : 'ai')}
                    onSettings={cycleTheme}
                    onTogglePlanetStyle={togglePlanetStyle}
                    activeView={currentView}
                    petAvatar={pet.avatarUrl}
                    petName={pet.name}
                    onAddPet={() => setIsAddPetModalOpen(true)}
                />
                {renderMainContent()}
                {currentView === 'space' && (
                    <TourControl
                        active={tourActive}
                        index={tourIndex}
                        total={memories.length}
                        onStart={startTour}
                        onStop={stopTour}
                    />
                )}
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

            <AddPetModal
                isOpen={isAddPetModalOpen}
                onClose={() => setIsAddPetModalOpen(false)}
            />

            <ToastHost />
            <ConfirmDialog />

            <OnThisDayModal
                isOpen={showOnThisDay}
                matches={onThisDayMatches}
                onClose={() => setShowOnThisDay(false)}
                onGoto={(id) => {
                    selectMemory(id);
                    setFocusedMemory(id);
                    setCurrentView('space');
                    setShowRightPanel(true);
                    setShowOnThisDay(false);
                }}
            />
            <LetterReader
                isOpen={showLetterReader}
                letter={dueLetter}
                onClose={() => setShowLetterReader(false)}
            />
            <MemorialModal
                isOpen={showMemorial}
                pet={pet}
                onClose={() => setShowMemorial(false)}
            />

            <div className={`transition-overlay ${(isTransitioning || isInitialFade) ? 'transition-overlay--visible' : ''}`}>
                {isInitialFade && (
                    <div className="startup-logo-container">
                        <img src="/assets/images/opening_logo.png" alt="Pet Memo" className="startup-logo" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
