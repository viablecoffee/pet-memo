import React, { useState, useRef } from 'react';
import './AddMemoryModal.css';
import { useStore } from '../../store/useStore';
import type { Memory } from '../../types';
import { compressImage } from '../../utils/image';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose }) => {
  const { addMemory, pet } = useStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🐾');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_PHOTOS = 9;
  const MAX_DESC_LENGTH = 200;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const compressed = await compressImage(event.target.result as string);
            setPhotos(prev => [...prev, compressed]);
          } catch (error) {
            console.error('Failed to compress image:', error);
            setPhotos(prev => [...prev, event.target!.result as string]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_DESC_LENGTH) {
      setDescription(text);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newMemory: Memory = {
      id: generateId(),
      petId: pet.id,
      date,
      title: title.trim(),
      description: description.trim(),
      photos,
      emoji: icon,
    };

    addMemory(newMemory);
    onClose();
    setTitle('');
    setDescription('');
    setPhotos([]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">New Memory</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              placeholder="e.g. Adoption Day" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              {['🐾', '🎂', '✈️', '🦮', '❄️', '☀️', '🌙', '✦'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`icon-btn ${icon === emoji ? 'active' : ''}`}
                  onClick={() => setIcon(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Photos <span className="char-count">({photos.length}/{MAX_PHOTOS})</span></label>
            <div className="photo-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="photo-add-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={photos.length >= MAX_PHOTOS}
              >
                + Add Photos
              </button>
              {photos.length > 0 && (
                <div className="photo-preview-grid">
                  {photos.map((photo, index) => (
                    <div key={index} className="photo-preview">
                      <img src={photo} alt="" />
                      <button
                        type="button"
                        className="photo-remove"
                        onClick={() => removePhoto(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Memory Description <span className="char-count">({description.length}/{MAX_DESC_LENGTH})</span></label>
            <textarea 
              rows={4} 
              placeholder="Write something beautiful..." 
              value={description} 
              onChange={handleDescriptionChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Create Star Memory
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;
