import React, { useState, useRef } from 'react';
import './PetProfile.css';
import { useStore } from '../../store/useStore';
import type { Pet } from '../../types';
import AvatarBuilder from '../AvatarBuilder/AvatarBuilder';

const PetProfile: React.FC = () => {
  const { pet, memories, updatePet } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Pet>(pet);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryKey, setGalleryKey] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(memories.length / itemsPerPage);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setGalleryIndex(i => (i + 1) % totalPages);
    } else if (e.deltaY < 0) {
      setGalleryIndex(i => (i - 1 + totalPages) % totalPages);
    }
    setGalleryKey(k => k + 1);
  };

  const handleNavClick = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setGalleryIndex(i => (i + 1) % totalPages);
    } else {
      setGalleryIndex(i => (i - 1 + totalPages) % totalPages);
    }
    setGalleryKey(k => k + 1);
  };

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

  const genderOptions = [
    { value: '', label: 'Not set' },
    { value: 'male', label: '♂ Male' },
    { value: 'female', label: '♀ Female' }
  ];

  if (isEditing) {
    return (
      <div className="pet-profile" onClick={() => setIsGenderOpen(false)}>
        <div className="pet-profile-frame" onClick={(e) => e.stopPropagation()}>
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
                  <div className="custom-dropdown">
                    <div
                      className={`dropdown-trigger ${isGenderOpen ? 'dropdown-trigger--open' : ''}`}
                      onClick={() => setIsGenderOpen(!isGenderOpen)}
                    >
                      {genderOptions.find(o => o.value === editForm.gender)?.label || 'Not set'}
                      <span className="dropdown-arrow">▼</span>
                    </div>
                    {isGenderOpen && (
                      <div className="dropdown-options">
                        {genderOptions.map(option => (
                          <div
                            key={option.value}
                            className={`dropdown-option ${editForm.gender === option.value ? 'dropdown-option--selected' : ''}`}
                            onClick={() => {
                              setEditForm({ ...editForm, gender: option.value });
                              setIsGenderOpen(false);
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

  if (isAvatarBuilderOpen) {
    return (
      <div className="pet-profile">
        <div className="pet-profile-frame">
          <AvatarBuilder
            isOpen={isAvatarBuilderOpen}
            onClose={() => setIsAvatarBuilderOpen(false)}
          />
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
            <div className="pet-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
              <button className="pet-edit-btn" onClick={() => { setEditForm(pet); setIsEditing(true); }}>
                ✏️ Edit Profile
              </button>
              <button className="pet-edit-btn" onClick={() => setIsAvatarBuilderOpen(true)} style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', border: 'none' }}>
                🎨 Customize Avatar
              </button>
            </div>
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
            <div 
              className="memories-gallery"
              onWheel={handleWheel}
              ref={galleryRef}
            >
              <button
                className="gallery-nav gallery-nav--prev"
                onClick={() => handleNavClick('prev')}
              >←</button>

              {[0, 1, 2].map((offset) => {
                const memIndex = (galleryIndex * itemsPerPage + offset) % memories.length;
                const memory = memories[memIndex];
                const handleClick = () => {
                  if (!memory.photos?.[0]) return;
                  if (lastClickedIndex === offset && enlargedImage) {
                    setEnlargedImage(null);
                    setLastClickedIndex(null);
                  } else {
                    setEnlargedImage(memory.photos[0]);
                    setLastClickedIndex(offset);
                  }
                };
                return (
                  <div
                    key={`${galleryKey}-${offset}`}
                    className="memory-highlight-item"
                    onClick={handleClick}
                  >
                    {memory.photos && memory.photos.length > 0 ? (
                      <div className="memory-highlight-img">
                        <img src={memory.photos[0]} alt={memory.title} />
                      </div>
                    ) : (
                      <div className="memory-highlight-placeholder">
                        <span className="memory-emoji">{memory.emoji}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                className="gallery-nav gallery-nav--next"
                onClick={() => handleNavClick('next')}
              >→</button>
            </div>

            {enlargedImage && (
              <div className="image-enlarged" onClick={() => setEnlargedImage(null)}>
                <img src={enlargedImage} alt="Enlarged" />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default PetProfile;
