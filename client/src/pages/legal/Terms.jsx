import LegalDocument from '../../components/common/LegalDocument.jsx';

// Paste your approved text into each section ([PASTE TEXT]).
// Separate paragraphs with a blank line. Update LAST_UPDATED whenever the text changes.
const LAST_UPDATED = '[DD Month YYYY]';
const INTRO = '[PASTE INTRO]';

const SECTIONS = [
  { id: 'acceptance-of-terms', heading: "Acceptance of terms", body: '[PASTE TEXT]' },
  { id: 'services', heading: "Services", body: '[PASTE TEXT]' },
  { id: 'fees-and-payment', heading: "Fees and payment", body: '[PASTE TEXT]' },
  { id: 'refund-policy', heading: "Refund policy", body: '[PASTE TEXT]' },
  { id: 'no-guarantee-of-returns', heading: "No guarantee of returns", body: '[PASTE TEXT]' },
  { id: 'limitation-of-liability', heading: "Limitation of liability", body: '[PASTE TEXT]' },
  { id: 'governing-law-and-jurisdiction', heading: "Governing law and jurisdiction", body: '[PASTE TEXT]' },
];

export default function Terms() {
  return <LegalDocument title="Terms & Conditions" lastUpdated={LAST_UPDATED} intro={INTRO} sections={SECTIONS} />;
}
