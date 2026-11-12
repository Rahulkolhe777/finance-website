// Full number with country code, digits only (e.g. 91XXXXXXXXXX).
const WHATSAPP_NUMBER = '917038909149';

const styles = `
.whatsapp-fab {
  position: fixed;
  right: calc(1rem + env(safe-area-inset-right, 0px));
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  z-index: 150;
  width: 56px;
  height: 56px;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #128C7E;
  color: #fff;
  box-shadow: 0 10px 24px rgba(6, 17, 28, 0.3);
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.whatsapp-fab:hover,
.whatsapp-fab:focus-visible {
  color: #fff;
  transform: scale(1.06);
  box-shadow: 0 14px 30px rgba(6, 17, 28, 0.35);
}
.whatsapp-fab:focus-visible { outline: 3px solid #0B1B2B; outline-offset: 3px; }
@media (max-width: 768px) {
  .whatsapp-fab { display: inline-flex; }
}
@media (prefers-reduced-motion: reduce) {
  .whatsapp-fab { transition: none; }
}
`;

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-fab"
      href={'https://wa.me/' + WHATSAPP_NUMBER}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
    >
      <style>{styles}</style>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" />
      </svg>
    </a>
  );
}
