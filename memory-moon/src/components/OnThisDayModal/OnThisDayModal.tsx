import React from 'react';
import './OnThisDayModal.css';
import Modal from '../Modal/Modal';
import type { OnThisDayMatch } from '../../utils/anniversary';

interface OnThisDayModalProps {
  isOpen: boolean;
  matches: OnThisDayMatch[];
  onClose: () => void;
  onGoto: (id: string) => void;
}

const OnThisDayModal: React.FC<OnThisDayModalProps> = ({ isOpen, matches, onClose, onGoto }) => {
  const primary = matches[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="那年今日 · On This Day"
      contentClassName="onthisday-modal"
      footer={
        primary && (
          <button className="submit-btn" onClick={() => onGoto(primary.id)}>
            前往这段回忆
          </button>
        )
      }
    >
      {primary && (
        <div className="onthisday-body">
          <div className="onthisday-photo">
            {primary.photos && primary.photos.length > 0 ? (
              <img src={primary.photos[0]} alt={primary.title} />
            ) : (
              <span className="onthisday-emoji">{primary.emoji || '🌙'}</span>
            )}
          </div>
          <div className="onthisday-years">{primary.yearsAgo} 年前的今天</div>
          <h3 className="onthisday-title">{primary.title}</h3>
          <p className="onthisday-desc">{primary.description}</p>

          {matches.length > 1 && (
            <div className="onthisday-more">
              <span className="onthisday-more-label">同一天还有 {matches.length - 1} 段回忆</span>
              {matches.slice(1).map(m => (
                <button key={m.id} className="onthisday-more-item" onClick={() => onGoto(m.id)}>
                  <span className="onthisday-more-emoji">{m.emoji || '✦'}</span>
                  <span className="onthisday-more-title">{m.title}</span>
                  <span className="onthisday-more-years">{m.yearsAgo}年前</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default OnThisDayModal;
