import React, { useEffect, useRef } from 'react';
import './MemoryCard.css';
import { useStore } from '../../store/useStore';
import type { Memory } from '../../types';

interface MemoryCardProps {
  memory: Memory | null;
}

const formatDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-');
  return `${y} · ${m} · ${d}`;
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => {
  const { deleteMemory } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!memory || !cardRef.current) return;
    if (prevIdRef.current === memory.id) return;
    prevIdRef.current = memory.id;

    const el = cardRef.current;
    el.style.animation = 'none';
    // Trigger reflow
    void el.offsetWidth;
    el.style.animation = '';
  }, [memory?.id]);

  if (!memory) {
    return (
      <div className="memory-card glass-card memory-card--empty">
        <p>Select a memory from the timeline</p>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="memory-card glass-card">
      {/* Date + title */}
      <div className="memory-card__header">
        <span className="memory-card__star">✦</span>
        <span className="memory-card__date">{formatDate(memory.date)}</span>
      </div>
      <h3 className="memory-card__title">{memory.title}</h3>

      {/* Photo */}
      <div className="memory-card__photo-frame">
        {memory.photos.length > 0 ? (
          <img src={memory.photos[0]} alt={memory.title} className="memory-card__photo" />
        ) : (
          <div className="memory-card__photo-placeholder">
            <span>{memory.emoji || '🐾'}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="memory-card__desc">{memory.description}</p>

      {/* Footer */}
      <div className="memory-card__footer">
        <div className="memory-card__meta">
          <span className="memory-card__heart">♥</span>
          <span className="memory-card__tagline">Forever in my heart</span>
        </div>
        <div className="memory-card__actions">
          <button 
            className="action-btn" 
            onClick={() => deleteMemory(memory.id)}
            aria-label="Delete memory"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
