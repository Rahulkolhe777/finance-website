import LegalDocument from '../../components/common/LegalDocument.jsx';

// Paste your approved text into each section ([PASTE TEXT]).
// Separate paragraphs with a blank line. Update LAST_UPDATED whenever the text changes.
const LAST_UPDATED = '[DD Month YYYY]';
const INTRO = '[PASTE INTRO]';

const SECTIONS = [
  { id: 'information-we-collect', heading: "Information we collect", body: '[PASTE TEXT]' },
  { id: 'how-we-use-your-information', heading: "How we use your information", body: '[PASTE TEXT]' },
  { id: 'sharing-and-disclosure', heading: "Sharing and disclosure", body: '[PASTE TEXT]' },
  { id: 'data-storage-and-security', heading: "Data storage and security", body: '[PASTE TEXT]' },
  { id: 'cookies', heading: "Cookies", body: '[PASTE TEXT]' },
  { id: 'your-rights', heading: "Your rights", body: '[PASTE TEXT]' },
  { id: 'contact-for-privacy-questions', heading: "Contact for privacy questions", body: '[PASTE TEXT]' },
];

export default function PrivacyPolicy() {
  return <LegalDocument title="Privacy Policy" lastUpdated={LAST_UPDATED} intro={INTRO} sections={SECTIONS} />;
}
