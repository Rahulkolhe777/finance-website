import * as RadixAccordion from '@radix-ui/react-accordion';

const styles = `
.accordion {
  --ac-navy: #0B1B2B;
  --ac-emerald: #0B7A57;
  --ac-mint: #EEF5F2;
  --ac-border: #D9E5E0;
  --ac-muted: #4F5F6B;

  display: grid;
  gap: 0.75rem;
}
.accordion__item {
  background: #fff;
  border: 1px solid var(--ac-border);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.accordion__item[data-state='open'] {
  border-color: rgba(11, 122, 87, 0.4);
  box-shadow: 0 8px 22px rgba(11, 27, 43, 0.06);
}
.accordion__header { margin: 0; }
.accordion__trigger {
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 0;
  background: transparent;
  color: var(--ac-navy);
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}
.accordion__trigger:hover { color: var(--ac-emerald); }
.accordion__trigger:focus-visible {
  outline: 2px solid var(--ac-emerald);
  outline-offset: -2px;
  border-radius: 16px;
}
.accordion__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--ac-mint);
  color: var(--ac-emerald);
  transition: transform 250ms ease, background-color 200ms ease, color 200ms ease;
}
.accordion__trigger[data-state='open'] .accordion__icon {
  transform: rotate(45deg);
  background: var(--ac-emerald);
  color: #fff;
}
.accordion__content {
  overflow: hidden;
  color: var(--ac-muted);
  font-size: 0.9375rem;
  line-height: 1.7;
}
.accordion__content[data-state='open'] { animation: accordion-down 250ms ease; }
.accordion__content[data-state='closed'] { animation: accordion-up 200ms ease; }
.accordion__answer {
  padding: 0 1.25rem 1.25rem;
}
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .accordion__icon { transition: none; }
  .accordion__content[data-state='open'],
  .accordion__content[data-state='closed'] { animation: none; }
}
`;

// Single-open accordion (Radix UI). items: [{ question, answer }]
export default function Accordion({ items = [], defaultOpen }) {
  return (
    <>
      <style>{styles}</style>
      <RadixAccordion.Root className="accordion" type="single" collapsible defaultValue={defaultOpen}>
        {items.map((item) => (
          <RadixAccordion.Item key={item.question} value={item.question} className="accordion__item">
            <RadixAccordion.Header className="accordion__header">
              <RadixAccordion.Trigger className="accordion__trigger">
                <span>{item.question}</span>
                <span className="accordion__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </RadixAccordion.Trigger>
            </RadixAccordion.Header>
            <RadixAccordion.Content className="accordion__content">
              <div className="accordion__answer">{item.answer}</div>
            </RadixAccordion.Content>
          </RadixAccordion.Item>
        ))}
      </RadixAccordion.Root>
    </>
  );
}
