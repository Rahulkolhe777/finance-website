import LegalDocument from '../../components/common/LegalDocument.jsx';

// Paste your approved text into each section ([PASTE TEXT]).
// Separate paragraphs with a blank line. Update LAST_UPDATED whenever the text changes.
const LAST_UPDATED = '[DD Month YYYY]';
const INTRO = '[PASTE INTRO]';

const SECTIONS = [
  { id: 'our-commitment', heading: "Our commitment", body: '[PASTE TEXT]' },
  { id: 'standards-we-follow', heading: "Standards we follow", body: '[PASTE TEXT]' },
  { id: 'measures-we-take', heading: "Measures we take", body: '[PASTE TEXT]' },
  { id: 'known-limitations', heading: "Known limitations", body: '[PASTE TEXT]' },
  { id: 'feedback-and-contact', heading: "Feedback and contact", body: '[PASTE TEXT]' },
];

export default function AccessibilityStatement() {
  return <LegalDocument title="Accessibility Statement" lastUpdated={LAST_UPDATED} intro={INTRO} sections={SECTIONS} />;
}
