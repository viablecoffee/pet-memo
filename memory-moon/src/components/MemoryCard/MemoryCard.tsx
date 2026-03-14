import React, { useEffect, useRef, useState } from 'react';
import './MemoryCard.css';
import type { Memory } from '../../types';

interface MemoryCardProps {
  memory: Memory | null;
  onEdit?: (memory: Memory) => void;
  onDelete?: (id: string) => void;
}

const formatDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-');
  return `${y} · ${m} · ${d}`;
};

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onEdit, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prevIdRef = useRef<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!memory || !cardRef.current) return;
    if (prevIdRef.current === memory.id) return;
    prevIdRef.current = memory.id;
    setPhotoIndex(0);

    const el = cardRef.current;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }, [memory?.id]);

  const goToPrev = () => {
    if (!memory) return;
    setPhotoIndex(i => (i > 0 ? i - 1 : memory.photos.length - 1));
  };

  const goToNext = () => {
    if (!memory) return;
    setPhotoIndex(i => (i < memory.photos.length - 1 ? i + 1 : 0));
  };

  if (!memory) {
    return (
      <div className="memory-card glass-card memory-card--empty">
        <span className="memory-card__empty-icon">🌙</span>
        <p className="memory-card__empty-text">Select a memory<br />from the timeline</p>
        <span className="memory-card__empty-hint">✦ or click a star in the sky</span>
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
          <>
            <img src={memory.photos[photoIndex]} alt={memory.title} className="memory-card__photo" />
            {memory.photos.length > 1 && (
              <>
                <button className="photo-nav photo-nav--prev" onClick={goToPrev}>←</button>
                <button className="photo-nav photo-nav--next" onClick={goToNext}>→</button>
                <div className="photo-indicator">
                  {memory.photos.map((_, i) => (
                    <span key={i} className={`photo-dot ${i === photoIndex ? 'active' : ''}`} />
                  ))}
                </div>
              </>
            )}
          </>
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
            onClick={() => onEdit?.(memory)}
            aria-label="Edit memory"
          >
            ✏️
          </button>
          <button
            className="action-btn"
            onClick={() => onDelete?.(memory.id)}
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
