import { useState, type FormEvent } from 'react';
import { siteConfig } from '../data/config';
import { submitOrder, type OrderPayload } from '../utils/orderSubmit';

interface Props {
  buildPayload: (contact: {
    name: string;
    email: string;
    shippingCountry: string;
    notes: string;
  }) => OrderPayload;
  submitLabel?: string;
  validate?: () => string | null;
}

export function OrderForm({ buildPayload, submitLabel = 'Submit order request', validate }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback' | 'error'>('idle');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [mailto, setMailto] = useState('');
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !shippingCountry.trim()) {
      setError('Name, email, and shipping country are required.');
      return;
    }
    const extra = validate?.();
    if (extra) {
      setError(extra);
      return;
    }
    setStatus('sending');
    const payload = buildPayload({
      name: name.trim(),
      email: email.trim(),
      shippingCountry: shippingCountry.trim(),
      notes: notes.trim(),
    });
    const result = await submitOrder(payload);
    if (result.mode === 'endpoint') {
      if (result.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setError(result.error);
      }
    } else {
      setSummary(result.summary);
      setMailto(result.mailto);
      setStatus('fallback');
    }
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (status === 'sent') {
    return (
      <div className="alert alert-success" role="status">
        <strong>Request sent.</strong> We emailed {siteConfig.orderEmail} and will follow up
        with an invoice — nothing was charged.
      </div>
    );
  }

  if (status === 'fallback') {
    return (
      <div className="alert alert-success" role="status">
        <strong>Order summary ready.</strong> No form endpoint is configured, so nothing was
        uploaded. Copy the summary or open your email client.
        <div style={{ marginTop: '1rem' }}>
          <pre className="summary-box">{summary}</pre>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-primary" onClick={copySummary}>
            {copied ? 'Copied!' : 'Copy summary'}
          </button>
          <a className="btn btn-ghost" href={mailto}>
            Open email draft
          </a>
        </div>
        <p className="hint" style={{ marginTop: '0.75rem' }}>
          This draft goes to {siteConfig.orderEmail}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field-row field-row-2">
        <div className="field">
          <label htmlFor="order-name">Name *</label>
          <input
            id="order-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="order-email">Email *</label>
          <input
            id="order-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="order-country">Shipping country *</label>
        <input
          id="order-country"
          name="shippingCountry"
          autoComplete="country-name"
          value={shippingCountry}
          onChange={(e) => setShippingCountry(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="order-notes">Notes</label>
        <textarea
          id="order-notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Deadlines, paint requests, assembly preferences…"
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {status === 'error' && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          Could not send the request. Try again in a moment.
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : submitLabel}
      </button>
      <p className="hint">
        This is an order request only. You will be invoiced later — no payment on this site.
      </p>
    </form>
  );
}
