import React, { useCallback } from 'react';
import './MusicPlayer.css';
import { useStore, LoopMode } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';

interface MusicPlayerProps {
  isActive: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isActive }) => {
  const { isPlaying, setPlaying, tracks, currentTrackId, setCurrentTrack, loopMode, setLoopMode } = useStore();
  const [isPlaylistOpen, setIsPlaylistOpen] = React.useState(false);
  
  const currentTrack = tracks.find(t => t.id === currentTrackId) || tracks[0];

  // Get playback state from hook
  const { position, duration, seek } = useAudio(currentTrack.url, isActive);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * duration);
  }, [seek, duration]);

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  const togglePlaylist = () => setIsPlaylistOpen(!isPlaylistOpen);

  const cycleLoopMode = () => {
    const modes: LoopMode[] = ['list', 'single', 'random'];
    const currentIndex = modes.indexOf(loopMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setLoopMode(nextMode);
  };

  return (
    <div className={`music-player glass-card ${!isActive ? 'player--hidden' : ''}`}>
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

      {/* Track info & Indicators */}
      <div className="player-main">
        <div className="player-track-info">
          <span className="player-track-name">{currentTrack.name}</span>
          <div className="player-dots">
            {[0, 1, 2].map(i => (
              <span key={i} className={`player-dot ${isPlaying ? 'player-dot--active' : ''}`} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="player-progress"
        onClick={handleSeek}
        role="slider"
        aria-label="Progress"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="player-progress-fill" style={{ width: `${progressPercent}%` }} />
        <div className="player-progress-thumb" style={{ left: `${progressPercent}%` }} />
      </div>

      {/* Loop mode toggle */}
      <button 
        className="player-btn player-loop" 
        onClick={cycleLoopMode}
        aria-label={`Loop mode: ${loopMode}`}
      >
        {loopMode === 'list' && (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        )}
        {loopMode === 'single' && (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            <text x="12" y="15" fontSize="8" fontWeight="bold" fill="currentColor" strokeWidth="0" textAnchor="middle">1</text>
          </svg>
        )}
        {loopMode === 'random' && (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
        )}
      </button>

      {/* More / Playlist toggle */}
      <div className="player-more-container">
        <button 
          className={`player-btn player-more ${isPlaylistOpen ? 'active' : ''}`} 
          onClick={togglePlaylist}
          aria-label="Playlist"
        >
          <span>···</span>
        </button>

        {isPlaylistOpen && (
          <div className="playlist-popup glass-card">
            <header className="playlist-header">
              <span>Cloud Playlist</span>
            </header>
            <ul className="track-list">
              {tracks.map(track => (
                <li 
                  key={track.id} 
                  className={`track-item ${track.id === currentTrackId ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTrack(track.id);
                    setIsPlaylistOpen(false);
                    if (!isPlaying) setPlaying(true);
                  }}
                >
                  <span className="track-name">{track.name}</span>
                  {track.id === currentTrackId && <span className="track-playing">Playing</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
