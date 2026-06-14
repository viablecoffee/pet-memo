import React, { useEffect, useState } from 'react';
import './Toast.css';
import { useStore } from '../../store/useStore';
import type { Toast } from '../../store/useStore';

const ICONS: Record<Toast['type'], string> = {
  success: '✓',
  error: '⚠',
  info: '✦',
};

const EXIT_MS = 350; // keep in sync with .toast--leaving in Toast.css

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const [leaving, setLeaving] = useState(false);

  // Auto-dismiss after the toast's duration.
  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), toast.duration);
    return () => clearTimeout(t);
  }, [toast.duration]);

  // Once leaving, play the exit animation then remove from the store.
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => onDismiss(toast.id), EXIT_MS);
    return () => clearTimeout(t);
  }, [leaving, toast.id, onDismiss]);

  return (
    <div
      className={`toast toast--${toast.type} ${leaving ? 'toast--leaving' : ''}`}
      role="status"
      aria-live="polite"
      onClick={() => setLeaving(true)}
    >
      <span className="toast__icon">{ICONS[toast.type]}</span>
      <span className="toast__msg">{toast.message}</span>
    </div>
  );
};

/**
 * ToastHost — single mount point (in App) for transient notifications.
 * Reusable feedback primitive: any action calls `addToast()` from the store.
 */
const ToastHost: React.FC = () => {
  const toasts = useStore(s => s.toasts);
  const dismissToast = useStore(s => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

export default ToastHost;
