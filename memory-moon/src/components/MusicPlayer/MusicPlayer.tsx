import React, { useRef, useState, useCallback } from 'react';
import './MusicPlayer.css';
import { useStore } from '../../store/useStore';

const MusicPlayer: React.FC = () => {
  const { isPlaying, setPlaying } = useStore();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setProgress(Math.max(0, Math.min(1, ratio)));
  }, []);

  return (
    <div className="music-player glass-card">
      {/* Play/Pause */}
      <button
        className="player-btn player-play"
        onClick={() => setPlaying(!isPlaying)}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        )}
      </button>

      {/* Dot indicators */}
      <div className="player-dots">
        {[0, 1, 2].map(i => (
          <span key={i} className={`player-dot ${isPlaying ? 'player-dot--active' : ''}`} style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="player-progress"
        onClick={handleProgressClick}
        role="slider"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="player-progress-fill" style={{ width: `${progress * 100}%` }} />
        <div className="player-progress-thumb" style={{ left: `${progress * 100}%` }} />
      </div>

      {/* More */}
      <button className="player-btn player-more" aria-label="More">
        <span>···</span>
      </button>
    </div>
  );
};

export default MusicPlayer;
