import React from 'react';
import './App.css';
import StarField from './components/StarField/StarField';
import MoonScene from './components/MoonScene/MoonScene';

const App: React.FC = () => {
    return (
        <div className="app">
            {/* Layer 0: particle star field background */}
            <StarField />

            {/* Layer 1: 3D moon scene */}
            <MoonScene />

            {/* Layer 2: UI overlay */}
            <div className="app-ui" style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)' }}>
                <h1 style={{ pointerEvents: 'auto' }}>memory-moon</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '10px', pointerEvents: 'auto' }}>Graphics & Particles Rebuilt</p>
            </div>
        </div>
    );
};

export default App;
