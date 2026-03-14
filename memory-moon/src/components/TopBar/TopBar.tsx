import React from 'react';
import './TopBar.css';

interface TopBarProps {
  onSearch?: () => void;
  onMusic?: () => void;
  onSettings?: () => void;
  onTogglePlanetStyle?: () => void;
  onPetProfile?: () => void;
  onAI?: () => void;
  onSpace?: () => void;
  isVisible: boolean;
  activeView?: 'space' | 'profile' | 'ai';
  petAvatar?: string;
  petName?: string;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, onMusic, onSettings, onTogglePlanetStyle, onPetProfile, onAI, onSpace, isVisible, activeView = 'space', petAvatar, petName }) => {
  return (
    <header className={`topbar ${isVisible ? 'topbar--visible' : ''}`}>
      <div className="topbar__left">
        <div className="topbar__brand">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="topbar__brand-icon">
            <path d="M12,2.1L9,2.1C8,2.1 7.1,2.9 7.1,3.9L7.1,4.9C7.1,5.9 8,6.7 9,6.7L12,6.7C13,6.7 13.9,5.9 13.9,4.9L13.9,3.9C13.9,2.9 13,2.1 12,2.1M5,6.1C4,6.1 3.1,6.9 3.1,7.9L3.1,8.9C3.1,9.9 4,10.7 5,10.7L8,10.7C9,10.7 9.9,9.9 9.9,8.9L9.9,7.9C9.9,6.9 9,6.1 8,6.1L5,6.1M19,6.1L16,6.1C15,6.1 14.1,6.9 14.1,7.9L14.1,8.9C14.1,9.9 15,10.7 16,10.7L19,10.7C20,10.7 20.9,9.9 20.9,8.9L20.9,7.9C20.9,6.9 20,6.1 19,6.1M12,12.1L9,12.1C8,12.1 7.1,12.9 7.1,13.9L7.1,14.9C7.1,15.9 8,16.7 9,16.7L12,16.7C13,16.7 13.9,15.9 13.9,14.9L13.9,13.9C13.9,12.9 13,12.1 12,12.1Z" />
          </svg>
          <span className="topbar__brand-name">Pet Memory Space</span>
        </div>
      </div>

      <nav className="topbar__nav">
        <button
          className={`topbar__nav-link ${activeView === 'space' ? 'topbar__nav-link--active' : ''}`}
          onClick={() => activeView !== 'space' && onSpace?.()}
        >
          Memory Space
        </button>
        <button
          className={`topbar__nav-link ${activeView === 'ai' ? 'topbar__nav-link--active' : ''}`}
          onClick={onAI}
        >
          AI Companion
        </button>
        <button
          className={`topbar__nav-link ${activeView === 'profile' ? 'topbar__nav-link--active' : ''}`}
          onClick={onPetProfile}
        >
          Pet Profile
        </button>
      </nav>

      <div className="topbar__right">
        <div className="topbar__actions">
          <button className="topbar__btn" onClick={onSearch} aria-label="Search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
          <button className="topbar__btn" onClick={onMusic} aria-label="Music">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </button>
          <button className="topbar__btn" onClick={onTogglePlanetStyle} aria-label="Toggle Planet Style">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <button className="topbar__btn" onClick={onSettings} aria-label="Settings">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
            </svg>
          </button>
        </div>

        <div className="topbar__profile">
          <img src={petAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${petName || 'Milo'}`} alt={petName || 'Milo'} className="topbar__avatar" />
          <span className="topbar__username">{petName || 'Milo'}</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="topbar__dropdown-icon">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
