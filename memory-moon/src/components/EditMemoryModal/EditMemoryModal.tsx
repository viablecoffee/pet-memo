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
  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_PHOTOS = 9;
  const MAX_DESC_LENGTH = 200;

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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_DESC_LENGTH) {
      setDescription(text);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

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

    // Trigger fade out
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'modal-overlay--closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content glass-card ${isClosing ? 'modal-content--closing' : ''}`} onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">Edit Memory</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </header>

        <form id="edit-memory-form" className="modal-form" onSubmit={handleSubmit}>
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
        </form>

        <div className="modal-form-footer">
          <button type="submit" form="edit-memory-form" className="submit-btn" aria-label="Save Changes">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMemoryModal;
