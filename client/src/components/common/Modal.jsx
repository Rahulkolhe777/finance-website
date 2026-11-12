import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const styles = `
.modal__backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(1rem, env(safe-area-inset-top, 0px)) 1rem max(1rem, env(safe-area-inset-bottom, 0px));
  background: rgba(6, 17, 28, 0.65);
  animation: modal-fade 200ms ease;
}
.modal {
  position: relative;
  width: 100%;
  max-width: 440px;
  max-height: 100%;
  overflow-y: auto;
  padding: 2rem 1.75rem 1.75rem;
  border-radius: 24px;
  background: #fff;
  color: #0B1B2B;
  box-shadow: 0 30px 60px rgba(6, 17, 28, 0.35);
  animation: modal-rise 250ms ease;
}
.modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: #0B1B2B;
  cursor: pointer;
}
.modal:focus { outline: none; }
.modal__close:hover { background: #EEF5F2; }
.modal__close:focus-visible { outline: 2px solid #0B7A57; outline-offset: 2px; }
.modal__title {
  margin: 0 2.5rem 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
@keyframes modal-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes modal-rise { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .modal__backdrop,
  .modal { animation: none; }
}
`;

// Accessible dialog: focus trap, Escape to close, focus restore, scroll lock.
export default function Modal({ open, onClose, title, children, closeOnBackdrop = true }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  // Keep the latest onClose without re-running the open effect (which would steal focus).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () => Array.from(dialog.querySelectorAll(FOCUSABLE));
    // Focus the dialog itself (not an input) so mobile keyboards don't pop up unasked.
    dialog.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="modal__backdrop" onMouseDown={closeOnBackdrop ? onClose : undefined}>
      <style>{styles}</style>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {title && <h2 id={titleId} className="modal__title">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
}
