import React from 'react';
import './TopBar.css';

interface TopBarProps {
  onSearch?: () => void;
  onMusic?: () => void;
  onSettings?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, onMusic, onSettings }) => {
  return (
    <header className="topbar">
      <div className="topbar__center">
        <h1 className="topbar__title">Memory Moon</h1>
        <p className="topbar__subtitle">Every star holds a memory</p>
      </div>
      <div className="topbar__actions">
        <button className="topbar__btn" onClick={onSearch} aria-label="Search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <line x1="16.5" y1="16.5" x2="22" y2="22"/>
          </svg>
        </button>
        <button className="topbar__btn" onClick={onMusic} aria-label="Music">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </button>
        <button className="topbar__btn" onClick={onSettings} aria-label="Settings">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
