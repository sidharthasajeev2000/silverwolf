import { faqItems } from '../data/faq';

export function FAQ() {
  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1>FAQ</h1>
          <p>Lead times, materials, files, shipping, and how quotes work.</p>
        </header>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
