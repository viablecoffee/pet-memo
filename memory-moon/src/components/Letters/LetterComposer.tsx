import React, { useState, useEffect } from 'react';
import './Letters.css';
import Modal from '../Modal/Modal';
import { useStore } from '../../store/useStore';
import { todayYMD } from '../../utils/anniversary';

interface LetterComposerProps {
  isOpen: boolean;
  onClose: () => void;
}

const genId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const LetterComposer: React.FC<LetterComposerProps> = ({ isOpen, onClose }) => {
  const { addLetter } = useStore();
  const today = todayYMD();
  const [title, setTitle] = useState('');
  const [openDate, setOpenDate] = useState(today);
  const [message, setMessage] = useState('');

  // Fresh each time it opens.
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setOpenDate(todayYMD());
      setMessage('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addLetter({
      id: genId(),
      title: title.trim() || undefined,
      message: message.trim(),
      createdDate: today,
      openDate,
      opened: false,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="给它写一封信"
      contentClassName="letter-modal"
      footer={
        <button type="submit" form="letter-form" className="submit-btn" disabled={!message.trim()}>
          封存这封信
        </button>
      }
    >
      <form id="letter-form" className="modal-form" onSubmit={handleSubmit}>
        <p className="letter-hint">写下此刻想对它说的话，封存到未来的某一天再开启。</p>

        <div className="form-group">
          <label>标题（可选）</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="给未来的你"
          />
        </div>

        <div className="form-group">
          <label>开启日期</label>
          <input
            type="date"
            min={today}
            value={openDate}
            onChange={e => setOpenDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>信的内容</label>
          <textarea
            rows={6}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="此刻最想对它说的话…"
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default LetterComposer;
