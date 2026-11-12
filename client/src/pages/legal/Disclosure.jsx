import LegalDocument from '../../components/common/LegalDocument.jsx';

// Paste your approved text into each section ([PASTE TEXT]).
// Separate paragraphs with a blank line. Update LAST_UPDATED whenever the text changes.
const LAST_UPDATED = '[DD Month YYYY]';
const INTRO = '[PASTE INTRO]';

const SECTIONS = [
  { id: 'registration-details', heading: "Registration details", body: '[PASTE TEXT]' },
  { id: 'business-activity', heading: "Business activity", body: '[PASTE TEXT]' },
  { id: 'disciplinary-history', heading: "Disciplinary history", body: '[PASTE TEXT]' },
  { id: 'terms-and-conditions-of-research', heading: "Terms and conditions of research", body: '[PASTE TEXT]' },
  { id: 'conflict-of-interest', heading: "Conflict of interest", body: '[PASTE TEXT]' },
  { id: 'compensation-and-holdings', heading: "Compensation and holdings", body: '[PASTE TEXT]' },
];

export default function Disclosure() {
  return <LegalDocument title="Disclosure" lastUpdated={LAST_UPDATED} intro={INTRO} sections={SECTIONS} />;
}
