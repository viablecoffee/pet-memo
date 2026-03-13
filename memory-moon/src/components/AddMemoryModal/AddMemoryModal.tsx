import React, { useState } from 'react';
import './AddMemoryModal.css';
import { useStore } from '../../store/useStore';
import type { Memory } from '../../types';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newMemory: Memory = {
      id: crypto.randomUUID(),
      petId: pet.id,
      date,
      title,
      description,
      photos: [],
      emoji: icon,
    };

    addMemory(newMemory);
    onClose();
    // Reset fields
    setTitle('');
    setDescription('');
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
            Create Star Memory
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;
