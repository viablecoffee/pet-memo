import React from 'react';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="app">
            {/* Layer 2: UI overlay */}
            <div className="app-ui" style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)' }}>
                <h1>memory-moon</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>Architecture Base</p>
            </div>
        </div>
    );
};

export default App;
