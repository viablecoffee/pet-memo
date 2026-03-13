import React from 'react';
import './Timeline.css';
import type { Memory } from '../../types';

interface TimelineProps {
  petName: string;
  memories: Memory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddClick: () => void;
}

const ICONS: Record<string, string> = {
  adoption: '🐾',
  birthday: '🎂',
  trip: '✈️',
  walk: '🦮',
  snow: '❄️',
  summer: '☀️',
  final: '🌙',
  default: '✦',
};

const getIcon = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('adopt')) return ICONS.adoption;
  if (t.includes('birth')) return ICONS.birthday;
  if (t.includes('trip') || t.includes('beach')) return ICONS.trip;
  if (t.includes('walk')) return ICONS.walk;
  if (t.includes('snow')) return ICONS.snow;
  if (t.includes('summer')) return ICONS.summer;
  if (t.includes('final') || t.includes('last')) return ICONS.final;
  return ICONS.default;
};

const Timeline: React.FC<TimelineProps> = ({ petName, memories, selectedId, onSelect, onAddClick }) => {
  // Group memories by year
  const byYear = memories.reduce<Record<string, Memory[]>>((acc, m) => {
    const year = m.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {});

  return (
    <aside className="timeline glass-card">
      <h2 className="timeline-title">{petName}'s Journey</h2>
      <div className="timeline-list">
        {Object.entries(byYear).map(([year, mems]) => (
          <div key={year} className="timeline-year-group">
            {mems.map((m, i) => (
              <div
                key={m.id}
                className={`timeline-item ${selectedId === m.id ? 'active' : ''}`}
                onClick={() => onSelect(m.id)}
              >
                {i === 0 && <span className="year-label">{year}</span>}
                <div className="timeline-dot">
                  <span className="dot-icon">{getIcon(m.title)}</span>
                </div>
                <span className="item-title">{m.title}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Add memory button */}
      <button className="add-memory-btn" aria-label="Add memory" onClick={onAddClick}>
        <span>＋</span> Add Memory
      </button>
    </aside>
  );
};

export default Timeline;
