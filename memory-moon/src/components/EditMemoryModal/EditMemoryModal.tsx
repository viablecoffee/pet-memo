import React from 'react';
import Modal from '../Modal/Modal';
import MemoryFields from '../MemoryFields/MemoryFields';
import { useMemoryForm } from '../../hooks/useMemoryForm';
import { useStore } from '../../store/useStore';
import type { Memory } from '../../types';

interface EditMemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditMemoryModal: React.FC<EditMemoryModalProps> = ({ memory, isOpen, onClose }) => {
  const { updateMemory } = useStore();
  const f = useMemoryForm(isOpen, memory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memory || !f.values.title || !f.values.description) return;
    updateMemory({ ...memory, ...f.values });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Memory"
      footer={
        <button type="submit" form="edit-memory-form" className="submit-btn" aria-label="Save Changes">
          Save Changes
        </button>
      }
    >
      <form id="edit-memory-form" className="modal-form" onSubmit={handleSubmit}>
        <MemoryFields f={f} />
      </form>
    </Modal>
  );
};

export default EditMemoryModal;
