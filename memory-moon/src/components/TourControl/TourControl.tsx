import React from 'react';
import './TourControl.css';

interface TourControlProps {
  active: boolean;
  index: number;
  total: number;
  onStart: () => void;
  onStop: () => void;
}

/** Floating play/stop pill for the guided "time journey" tour (space view). */
const TourControl: React.FC<TourControlProps> = ({ active, index, total, onStart, onStop }) => {
  if (total < 2) return null;

  return (
    <div className="tour-control">
      {active ? (
        <>
          <button className="tour-btn tour-btn--stop" onClick={onStop} aria-label="Stop tour">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
          </button>
          <span className="tour-progress">{index + 1} / {total}</span>
        </>
      ) : (
        <button className="tour-btn tour-btn--play" onClick={onStart} aria-label="Start memory tour">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          Memory Tour
        </button>
      )}
    </div>
  );
};

export default TourControl;
