import React from 'react';
import './PetProfile.css';
import { useStore } from '../../store/useStore';

interface PetProfileProps {
  onClose?: () => void;
}

const PetProfile: React.FC<PetProfileProps> = ({ onClose }) => {
  const { pet, memories } = useStore();

  return (
    <div className="pet-profile">
      <header className="pet-profile-header">
        <button className="pet-profile-back-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="pet-profile-title">Pet Profile</h1>
        <button className="pet-profile-settings-btn" aria-label="Settings">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
          </svg>
        </button>
      </header>

      <main className="pet-profile-main">
        <section className="pet-identity">
          <div className="pet-avatar-wrapper">
            <div className="pet-avatar-glow"></div>
            <img 
              src={pet.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pet.name}`}
              alt={pet.name} 
              className="pet-avatar" 
            />
          </div>
          <h2 className="pet-name">{pet.name} 🐾</h2>
          <p className="pet-breed">Golden Retriever</p>
        </section>

        <section className="pet-info-card">
          <h3 className="section-title">Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Pet Name</span>
              <span className="info-value">{pet.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">♂ Male</span>
            </div>
            <div className="info-item">
              <span className="info-label">Birthday</span>
              <span className="info-value">June 12, 2018</span>
            </div>
            <div className="info-item">
              <span className="info-label">Breed</span>
              <span className="info-value">Golden Retriever</span>
            </div>
            <div className="info-item">
              <span className="info-label">Weight</span>
              <span className="info-value">25 kg</span>
            </div>
            <div className="info-item">
              <span className="info-label">Color</span>
              <span className="info-value">Golden</span>
            </div>
          </div>
        </section>

        <section className="memories-section">
          <div className="memories-header">
            <h3 className="section-title">⭐ Total Memories</h3>
            <span className="memories-count">{memories.length} Memories</span>
          </div>
          <p className="memories-subtitle">Memory Highlights</p>
          <div className="memories-gallery">
            {memories.slice(0, 3).map((memory) => (
              <div key={memory.id} className="memory-highlight-item">
                <div className="memory-highlight-placeholder">
                  <span className="memory-emoji">{memory.emoji}</span>
                </div>
              </div>
            ))}
            <button className="add-memory-btn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PetProfile;
