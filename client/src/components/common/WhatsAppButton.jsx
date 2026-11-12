export default function WhatsAppButton({ phone = import.meta.env.VITE_WHATSAPP_NUMBER }) {
  if (!phone) return null;
  return (
    <a className="whatsapp-button" href={'https://wa.me/' + phone} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      WhatsApp
    </a>
  );
}
