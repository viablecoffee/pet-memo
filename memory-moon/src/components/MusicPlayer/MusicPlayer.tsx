import React, { useCallback } from 'react';
import './MusicPlayer.css';
import { useStore } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';

interface MusicPlayerProps {
  isActive: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isActive }) => {
  const { isPlaying, setPlaying, volume, setVolume, tracks, currentTrackId, setCurrentTrack } = useStore();
  const [isPlaylistOpen, setIsPlaylistOpen] = React.useState(false);
  
  const currentTrack = tracks.find(t => t.id === currentTrackId) || tracks[0];

  // Use the actual audio file found in the audio folder
  useAudio(currentTrack.url, isActive);

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, ratio)));
  }, [setVolume]);

  const togglePlaylist = () => setIsPlaylistOpen(!isPlaylistOpen);

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

      {/* Volume control */}
      <div
        className="player-progress"
        onClick={handleVolumeClick}
        role="slider"
        aria-label="Volume"
        aria-valuenow={Math.round(volume * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="player-progress-fill" style={{ width: `${volume * 100}%` }} />
        <div className="player-progress-thumb" style={{ left: `${volume * 100}%` }} />
      </div>

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
