import React from 'react';
import Modal from '../Modal/Modal';
import MemoryFields from '../MemoryFields/MemoryFields';
import { useMemoryForm } from '../../hooks/useMemoryForm';
import { useStore } from '../../store/useStore';
import type { Memory } from '../../types';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose }) => {
  const { addMemory, pet } = useStore();
  const f = useMemoryForm(isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.values.title || !f.values.description) return;
    const newMemory: Memory = { id: generateId(), petId: pet.id, ...f.values };
    addMemory(newMemory);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Memory"
      footer={
        <button type="submit" form="add-memory-form" className="submit-btn" aria-label="Create Star Memory">
          Create Star Memory
        </button>
      }
    >
      <form id="add-memory-form" className="modal-form" onSubmit={handleSubmit}>
        <MemoryFields f={f} />
      </form>
    </Modal>
  );
};

export default AddMemoryModal;
