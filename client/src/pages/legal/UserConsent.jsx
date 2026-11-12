import LegalDocument from '../../components/common/LegalDocument.jsx';

// Paste your approved text into each section ([PASTE TEXT]).
// Separate paragraphs with a blank line. Update LAST_UPDATED whenever the text changes.
const LAST_UPDATED = '[DD Month YYYY]';
const INTRO = '[PASTE INTRO]';

const SECTIONS = [
  { id: 'about-this-consent', heading: "About this consent", body: '[PASTE TEXT]' },
  { id: 'consent-to-be-contacted', heading: "Consent to be contacted", body: '[PASTE TEXT]' },
  { id: 'use-of-your-information', heading: "Use of your information", body: '[PASTE TEXT]' },
  { id: 'risk-acknowledgement', heading: "Risk acknowledgement", body: '[PASTE TEXT]' },
  { id: 'withdrawing-consent', heading: "Withdrawing consent", body: '[PASTE TEXT]' },
];

export default function UserConsent() {
  return <LegalDocument title="User Consent" lastUpdated={LAST_UPDATED} intro={INTRO} sections={SECTIONS} />;
}
