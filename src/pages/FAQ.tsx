import { faqItems } from '../data/faq';
import { Seo } from '../components/Seo';

export function FAQ() {
  return (
    <>
      <Seo
        title="FAQ"
        description="Answers about Silverwolf 3D prints: lead times, materials, custom STL quotes, shipping, and invoicing in ₹."
        path="/faq"
      />
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
    </>
  );
}
