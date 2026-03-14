import React, { useState, useRef } from 'react';
import './PetProfile.css';
import { useStore } from '../../store/useStore';
import type { Pet } from '../../types';

const PetProfile: React.FC = () => {
  const { pet, memories, updatePet } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Pet>(pet);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditForm({ ...editForm, avatarUrl: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updatePet(editForm);
    setIsEditing(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not set';
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
  };

  if (isEditing) {
    return (
      <div className="pet-profile">
        <div className="pet-profile-frame">
          <main className="pet-profile-main">
            <section className="pet-identity">
              <div className="pet-avatar-wrapper pet-avatar-wrapper--editing" onClick={() => fileInputRef.current?.click()}>
                <div className="pet-avatar-glow"></div>
                <img
                  src={editForm.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editForm.name}`}
                  alt={editForm.name}
                  className="pet-avatar"
                />
                <div className="pet-avatar-overlay">
                  <span className="pet-avatar-edit-icon">✏️</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                className="edit-name-input"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Pet Name"
              />
            </section>

            <section className="pet-info-card">
              <h3 className="section-title">Basic Information</h3>
              <div className="edit-form-grid">
                <div className="edit-form-item">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="edit-form-item">
                  <label>Gender</label>
                  <select
                    value={editForm.gender || ''}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="">Not set</option>
                    <option value="male">♂ Male</option>
                    <option value="female">♀ Female</option>
                  </select>
                </div>
                <div className="edit-form-item">
                  <label>Birthday</label>
                  <input
                    type="date"
                    value={editForm.birthDate || ''}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  />
                </div>
                <div className="edit-form-item">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={editForm.breed || ''}
                    onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                    placeholder="e.g. Golden Retriever"
                  />
                </div>
                <div className="edit-form-item">
                  <label>Weight</label>
                  <input
                    type="text"
                    value={editForm.weight || ''}
                    onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                    placeholder="e.g. 25 kg"
                  />
                </div>
                <div className="edit-form-item">
                  <label>Color</label>
                  <input
                    type="text"
                    value={editForm.color || ''}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    placeholder="e.g. Golden"
                  />
                </div>
              </div>
              <div className="edit-actions">
                <button className="edit-cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="edit-save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-profile">
      <div className="pet-profile-frame">
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
            <p className="pet-breed">{pet.breed || 'Pet'}</p>
            <button className="pet-edit-btn" onClick={() => { setEditForm(pet); setIsEditing(true); }}>
              ✏️ Edit Profile
            </button>
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
                <span className="info-value">{pet.gender === 'male' ? '♂ Male' : pet.gender === 'female' ? '♀ Female' : 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Birthday</span>
                <span className="info-value">{formatDate(pet.birthDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Breed</span>
                <span className="info-value">{pet.breed || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">{pet.weight || 'Not set'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Color</span>
                <span className="info-value">{pet.color || 'Not set'}</span>
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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PetProfile;
