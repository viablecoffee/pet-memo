import React, { useState, useMemo } from 'react';
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
  const byYear = useMemo(() => {
    return memories.reduce<Record<string, Memory[]>>((acc, m) => {
      const year = m.date.slice(0, 4);
      if (!acc[year]) acc[year] = [];
      acc[year].push(m);
      return acc;
    }, {});
  }, [memories]);

  const years = Object.keys(byYear).sort();

  // Default: expand the most recent year
  const [expandedYears, setExpandedYears] = useState<Set<string>>(
    () => new Set()
  );

  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const allExpanded = years.every(y => expandedYears.has(y));

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedYears(new Set());
    } else {
      setExpandedYears(new Set(years));
    }
  };

  return (
    <aside className="timeline glass-card">
      <div className="timeline-header-row">
        <h2 className="timeline-title">{petName}'s Journey</h2>
        <button className="timeline-toggle-all" onClick={toggleAll} title={allExpanded ? 'Collapse all' : 'Expand all'}>
          {allExpanded ? '−' : '+'}
        </button>
      </div>
      <div className="timeline-list">
        {years.map(year => {
          const mems = byYear[year];
          const isExpanded = expandedYears.has(year);
          const hasSelectedItem = mems.some(m => m.id === selectedId);

          return (
            <div key={year} className="timeline-year-group">
              {/* Year header - clickable to expand/collapse */}
              <button
                className={`timeline-year-header ${isExpanded ? 'expanded' : ''} ${hasSelectedItem ? 'has-active' : ''}`}
                onClick={() => toggleYear(year)}
                aria-expanded={isExpanded}
              >
                <span className="year-header__label">{year}</span>
                <span className="year-header__chevron">{isExpanded ? '▾' : '▸'}</span>

              </button>

              {/* Collapsible content */}
              {isExpanded && (
                <div className="timeline-year-items">
                  {mems.map(m => (
                    <div
                      key={m.id}
                      className={`timeline-item ${selectedId === m.id ? 'active' : ''}`}
                      onClick={() => onSelect(m.id)}
                    >
                      <div className="timeline-dot">
                        <span className="dot-icon">{getIcon(m.title)}</span>
                      </div>
                      <span className="item-title">{m.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add memory button */}
      <button className="add-memory-btn" aria-label="Add memory" onClick={onAddClick}>
        <span>＋</span> Add Memory
      </button>
    </aside>
  );
};

export default Timeline;

