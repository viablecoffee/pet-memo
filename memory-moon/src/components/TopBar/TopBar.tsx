import React, { useState, useEffect, useRef } from 'react';
import './TopBar.css';
import MusicPlayer from '../MusicPlayer/MusicPlayer';

interface TopBarProps {
  onSearch?: () => void;
  onSettings?: () => void;
  onTogglePlanetStyle?: () => void;
  onPetProfile?: () => void;
  onAI?: () => void;
  onSpace?: () => void;
  isVisible: boolean;
  isMusicOpen: boolean;
  onMusicToggle: (open: boolean) => void;
  onHoverChange?: (hovered: boolean) => void;
  activeView?: 'space' | 'profile' | 'ai';
  petAvatar?: string;
  petName?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  onSearch, onSettings, onTogglePlanetStyle, onPetProfile, onAI, onSpace,
  isVisible, isMusicOpen, onMusicToggle, onHoverChange,
  activeView = 'space', petAvatar, petName
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const musicContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuContainerRef = useRef<HTMLDivElement>(null);

  // Close music player and mobile menu if topbar is hidden
  useEffect(() => {
    if (!isVisible) {
      onMusicToggle(false);
      setIsMobileMenuOpen(false);
    }
  }, [isVisible, onMusicToggle]);

  // Click outside listener for both music player and mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle music player
      if (musicContainerRef.current && !musicContainerRef.current.contains(event.target as Node)) {
        onMusicToggle(false);
      }
      // Handle mobile menu
      if (mobileMenuContainerRef.current && !mobileMenuContainerRef.current.contains(event.target as Node)) {
        // Important: check if the click target is the menu button itself to avoid double-toggling
        const menuBtn = document.querySelector('.topbar__menu-btn');
        if (menuBtn && !menuBtn.contains(event.target as Node)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMusicOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMusicOpen, isMobileMenuOpen, onMusicToggle]);

  const handleNavClick = (callback: (() => void) | undefined) => {
    callback?.();
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`topbar ${isVisible ? 'topbar--visible' : ''}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className="topbar__left">
        <button
          className="topbar__menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <div className="topbar__brand">
          <img
            src="/assets/images/logo_pet_memo-removebg-preview.png"
            alt="Pet Memo"
            className="topbar__brand-img"
          />
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
          <button className="topbar__btn" onClick={onSearch} aria-label="Search" style={{ display: 'none' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
          <div className="topbar__music-container" ref={musicContainerRef}>
            <button
              className={`topbar__btn ${isMusicOpen ? 'topbar__btn--active' : ''}`}
              onClick={() => onMusicToggle(!isMusicOpen)}
              aria-label="Music"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </button>
            <div className={`topbar__music-popup ${isMusicOpen ? 'topbar__music-popup--visible' : ''}`}>
              <MusicPlayer isActive={true} />
            </div>
          </div>
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

      <div
        ref={mobileMenuContainerRef}
        className={`topbar__mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
      >
        <button
          className={`topbar__mobile-nav-link ${activeView === 'space' ? 'topbar__mobile-nav-link--active' : ''}`}
          onClick={() => handleNavClick(activeView !== 'space' ? onSpace : undefined)}
        >
          Memory Space
        </button>
        <button
          className={`topbar__mobile-nav-link ${activeView === 'ai' ? 'topbar__mobile-nav-link--active' : ''}`}
          onClick={() => handleNavClick(onAI)}
        >
          AI Companion
        </button>
        <button
          className={`topbar__mobile-nav-link ${activeView === 'profile' ? 'topbar__mobile-nav-link--active' : ''}`}
          onClick={() => handleNavClick(onPetProfile)}
        >
          Pet Profile
        </button>
      </div>
    </header>
  );
};

export default TopBar;
