import React, { useEffect } from 'react';
import './Letters.css';
import Modal from '../Modal/Modal';
import { useStore } from '../../store/useStore';
import type { Letter } from '../../types';

interface LetterReaderProps {
  isOpen: boolean;
  letter: Letter | null;
  onClose: () => void;
}

const LetterReader: React.FC<LetterReaderProps> = ({ isOpen, letter, onClose }) => {
  const openLetter = useStore(s => s.openLetter);

  // Mark as opened the first time it surfaces.
  useEffect(() => {
    if (isOpen && letter && !letter.opened) openLetter(letter.id);
  }, [isOpen, letter?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="一封为你封存的信"
      contentClassName="letter-modal"
      footer={
        <button className="submit-btn" onClick={onClose}>
          收下这封信
        </button>
      }
    >
      {letter && (
        <div className="letter-read-body">
          <div className="letter-seal">✉</div>
          {letter.title && <h3 className="letter-read-title">{letter.title}</h3>}
          <p className="letter-read-message">{letter.message}</p>
          <span className="letter-read-meta">写于 {letter.createdDate}</span>
        </div>
      )}
    </Modal>
  );
};

export default LetterReader;
