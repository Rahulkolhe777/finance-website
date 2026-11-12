import { useState } from 'react';

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="accordion__item">
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              {item.question}
            </button>
            {isOpen && <div className="accordion__panel">{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
