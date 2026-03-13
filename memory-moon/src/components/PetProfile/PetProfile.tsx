import React from 'react';
import './PetProfile.css';
import { useStore } from '../../store/useStore';

const PetProfile: React.FC = () => {
  const { pet, memories } = useStore();

  return (
    <div className="pet-profile">
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
            <button className="pet-profile-add-memory-btn">
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
