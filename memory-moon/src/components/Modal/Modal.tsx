import React, { useEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Modal — the shared shell for every dialog in the app.
 *
 * Owns the chrome and behavior so each modal only supplies its form:
 *  - enter / exit animation (driven purely by the `isOpen` prop)
 *  - click-outside + Escape to close
 *  - body scroll lock while open
 *  - focus move-in + a simple Tab focus-trap (a11y)
 *
 * Children render inside the scroll area; `footer` pins to a sticky footer
 * (so a submit button can live outside the scrolling form via the `form`
 * attribute, matching the existing memory-modal pattern).
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Sticky footer content (e.g. the submit button). */
  footer?: React.ReactNode;
  /** Extra class on the content box (e.g. "pet-modal"). */
  contentClassName?: string;
  /** Exit-animation length in ms; must match the CSS close duration. */
  closeMs?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  contentClassName = '',
  closeMs = 350,
}) => {
  const [render, setRender] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Keep latest onClose without retriggering the focus effect on every
  // parent re-render (parents pass inline arrows).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Drive enter/exit purely from isOpen.
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setClosing(false);
      return;
    }
    if (render) {
      setClosing(true);
      const t = setTimeout(() => {
        setRender(false);
        setClosing(false);
      }, closeMs);
      return () => clearTimeout(t);
    }
  }, [isOpen, render, closeMs]);

  // Body scroll lock while mounted.
  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [render]);

  // Focus move-in + Escape + Tab trap. Depends only on `render` so typing
  // (which re-renders the parent) never steals focus back to the first field.
  useEffect(() => {
    if (!render) return;
    const node = contentRef.current;
    if (!node) return;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    // Move focus into the dialog — prefer the first real form field over the
    // close button — unless focus is already inside (e.g. an autoFocus input).
    if (!node.contains(document.activeElement)) {
      const firstField = node.querySelector<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])'
      );
      (firstField ?? focusables()[0] ?? node).focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === 'Tab') {
        const els = focusables();
        if (els.length === 0) {
          e.preventDefault();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [render]);

  if (!render) return null;

  return createPortal(
    <div
      className={`modal-overlay ${closing ? 'modal-overlay--closing' : ''}`}
      onMouseDown={(e) => {
        // Only close on a press that starts on the backdrop itself.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={`modal-content glass-card ${contentClassName} ${closing ? 'modal-content--closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title" id={titleId}>
            {title}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </header>

        {children}

        {footer && <div className="modal-form-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
