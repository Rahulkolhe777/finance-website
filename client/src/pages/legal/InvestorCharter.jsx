import LegalDocument from '../../components/common/LegalDocument.jsx';

// Paste your approved text into each section ([PASTE TEXT]).
// Separate paragraphs with a blank line. Update LAST_UPDATED whenever the text changes.
const LAST_UPDATED = '[DD Month YYYY]';
const INTRO = '[PASTE INTRO]';

const SECTIONS = [
  { id: 'vision', heading: "Vision", body: '[PASTE TEXT]' },
  { id: 'mission', heading: "Mission", body: '[PASTE TEXT]' },
  { id: 'services-provided-to-investors', heading: "Services provided to investors", body: '[PASTE TEXT]' },
  { id: 'rights-of-investors', heading: "Rights of investors", body: '[PASTE TEXT]' },
  { id: 'investors-responsibilities-do-s-and-don-ts', heading: "Investors' responsibilities (Do's and Don'ts)", body: '[PASTE TEXT]' },
  { id: 'grievance-redressal-mechanism', heading: "Grievance redressal mechanism", body: '[PASTE TEXT]' },
];

export default function InvestorCharter() {
  return <LegalDocument title="Investor Charter" lastUpdated={LAST_UPDATED} intro={INTRO} sections={SECTIONS} />;
}
