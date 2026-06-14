import React from 'react';
import './MemorialModal.css';
import Modal from '../Modal/Modal';
import { yearsSince } from '../../utils/anniversary';
import type { Pet } from '../../types';

interface MemorialModalProps {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
}

const fmt = (d?: string) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${y} · ${m} · ${day}`;
};

/** Gentle remembrance surfaced on a passed pet's anniversary. */
const MemorialModal: React.FC<MemorialModalProps> = ({ isOpen, pet, onClose }) => {
  const years = pet?.passDate ? yearsSince(pet.passDate) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="In Loving Memory"
      contentClassName="memorial-modal"
      footer={<button className="submit-btn" onClick={onClose}>Always remembered</button>}
    >
      {pet && (
        <div className="memorial-modal-body">
          <div className="memorial-modal-dove">🕊</div>
          <img
            className="memorial-modal-avatar"
            src={pet.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pet.name}`}
            alt={pet.name}
          />
          <h3 className="memorial-modal-name">{pet.name}</h3>
          <p className="memorial-modal-years">
            {years > 0
              ? `${years} year${years > 1 ? 's' : ''} since you crossed the rainbow bridge`
              : 'Forever in our hearts'}
          </p>
          <p className="memorial-modal-dates">{fmt(pet.birthDate)} – {fmt(pet.passDate)}</p>
        </div>
      )}
    </Modal>
  );
};

export default MemorialModal;
