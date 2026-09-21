import { Seo } from '../components/Seo';

export function Policies() {
  return (
    <>
      <Seo
        title="Policies"
        description="Silverwolf order, custom print, shipping, and invoice policies. No payment is collected on this site."
        path="/policies"
      />
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1>Policies</h1>
          <p>Returns, props disclaimer, and order-request terms.</p>
        </header>
        <div className="prose">
          <h2>Order requests & payment</h2>
          <p>
            Submitting a form on this site creates an order <em>request</em>, not a completed
            purchase. No payment is collected here. Final price, shipping, and lead time are
            confirmed by invoice. Either party may decline before payment.
          </p>

          <h2>Props & replica disclaimer</h2>
          <p>
            All katanas, daggers, blades, armor, and similar items sold or printed through
            Silverwolf are <strong>cosplay and display prop replicas</strong>. They are made of
            plastic or similar materials, are blunt/decorative, and are <strong>not</strong>{' '}
            functional weapons. Do not use them as weapons. You are responsible for complying with
            local laws and event rules regarding prop weapons.
          </p>

          <h2>Custom prints & IP</h2>
          <p>
            You confirm you have the right to print any file you submit (original work, licensed
            model, or otherwise permitted). We may refuse files that appear to infringe rights or
            that we cannot safely print.
          </p>

          <h2>Returns & refunds</h2>
          <ul>
            <li>
              Ready-made catalog items: contact within 7 days of delivery for damaged or defective
              prints. Photos help. We will reprint or refund at our discretion.
            </li>
            <li>
              Custom prints: because they are made to your file and settings, returns are limited
              to manufacturing defects (wrong material, severe print failure). Design issues in the
              provided STL are not grounds for refund.
            </li>
            <li>Buyer-remorse returns on opened cosplay props may be declined.</li>
          </ul>

          <h2>Shipping</h2>
          <p>
            Shipping cost and method are set on the invoice based on destination and package size.
            Risk of loss transfers according to the carrier terms selected at fulfillment. Provide
            a complete, accurate address on request.
          </p>

          <h2>Quotes</h2>
          <p>
            In-browser STL quotes are approximate estimates based on mesh volume and configurable
            rates. They are not binding. Supports, rafts, orientation, failure reprints, and
            finishing can change the final price.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
