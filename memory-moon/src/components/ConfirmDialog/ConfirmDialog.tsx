import React, { useEffect, useState } from 'react';
import './ConfirmDialog.css';
import Modal from '../Modal/Modal';
import { useStore } from '../../store/useStore';
import type { ConfirmOptions } from '../../store/useStore';

/**
 * ConfirmDialog — single host for confirmation prompts, mounted once in App.
 *
 * Any component requests a confirm via the store:
 *   const ok = await requestConfirm({ title, message, tone: 'danger' });
 * and gets a Promise<boolean>. Built on <Modal>, so it inherits the shared
 * chrome, animation, Esc/click-outside (both resolve to "false"/cancel).
 *
 * A deliberate dialog (vs. an auto-dismissing toast) is the right pattern for
 * destructive actions the user must consciously confirm.
 */
const ConfirmDialog: React.FC = () => {
  const confirm = useStore(s => s.confirm);
  const resolveConfirm = useStore(s => s.resolveConfirm);

  // Retain the last options during the exit animation so content doesn't blank.
  const [shown, setShown] = useState<ConfirmOptions | null>(confirm);
  useEffect(() => {
    if (confirm) setShown(confirm);
  }, [confirm]);

  const tone = shown?.tone ?? 'default';

  return (
    <Modal
      isOpen={!!confirm}
      onClose={() => resolveConfirm(false)}
      title={shown?.title ?? ''}
      contentClassName="confirm-modal"
      footer={
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={() => resolveConfirm(false)}>
            {shown?.cancelLabel ?? 'Cancel'}
          </button>
          <button
            className={`confirm-ok ${tone === 'danger' ? 'confirm-ok--danger' : ''}`}
            onClick={() => resolveConfirm(true)}
          >
            {shown?.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      }
    >
      <p className="confirm-body">{shown?.message}</p>
    </Modal>
  );
};

export default ConfirmDialog;
