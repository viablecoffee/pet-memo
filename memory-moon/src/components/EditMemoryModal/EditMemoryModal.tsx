import React, { useState, useRef, useEffect } from 'react';
import './EditMemoryModal.css';
import { useStore } from '../../store/useStore';
import type { Memory } from '../../types';
import { compressImage } from '../../utils/image';

interface EditMemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditMemoryModal: React.FC<EditMemoryModalProps> = ({ memory, isOpen, onClose }) => {
  const { updateMemory } = useStore();
  const [date, setDate] = useState(memory?.date || '');
  const [title, setTitle] = useState(memory?.title || '');
  const [description, setDescription] = useState(memory?.description || '');
  const [icon, setIcon] = useState(memory?.emoji || '🐾');
  const [photos, setPhotos] = useState<string[]>(memory?.photos || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && memory) {
      setDate(memory.date);
      setTitle(memory.title);
      setDescription(memory.description);
      setIcon(memory.emoji || '🐾');
      setPhotos(memory.photos);
    }
  }, [isOpen, memory]);

  if (!isOpen || !memory) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const compressed = await compressImage(event.target.result as string);
            setPhotos(prev => [...prev, compressed]);
          } catch (error) {
            console.error('Failed to compress image:', error);
            // Fallback to original if compression fails
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const updatedMemory: Memory = {
      ...memory,
      date,
      title: title.trim(),
      description: description.trim(),
      photos,
      emoji: icon,
    };

    updateMemory(updatedMemory);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">Edit Memory</h2>
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
            <label>Photos</label>
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
            <label>Memory Description</label>
            <textarea 
              rows={4} 
              placeholder="Write something beautiful..." 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMemoryModal;
