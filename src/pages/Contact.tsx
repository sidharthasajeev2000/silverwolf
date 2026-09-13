import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/config';
import { submitOrder } from '../utils/orderSubmit';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback' | 'error'>('idle');
  const [error, setError] = useState('');
  const [mailto, setMailto] = useState('');
  const [summary, setSummary] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Name, email, and a message are required.');
      return;
    }
    setStatus('sending');
    const body = [
      'Silverwolf — Contact message',
      '---------------------------',
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      '',
      message.trim(),
    ].join('\n');
    const result = await submitOrder({
      type: 'contact',
      name: name.trim(),
      email: email.trim(),
      shippingCountry: 'n/a',
      details: message.trim(),
      summary: body,
    });
    if (result.mode === 'endpoint') {
      if (result.ok) setStatus('sent');
      else {
        setStatus('error');
        setError(result.error);
      }
    } else {
      setSummary(result.summary);
      setMailto(result.mailto);
      setStatus('fallback');
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <header className="page-header">
          <h1>Contact</h1>
          <p>
            Questions about an order, lead time, or a custom print? Send a message — it goes to{' '}
            {siteConfig.orderEmail} the same way shop orders do.
          </p>
        </header>

        {status === 'sent' ? (
          <div className="alert alert-success" role="status">
            <strong>Message sent.</strong> We emailed {siteConfig.orderEmail} and will reply when we
            can.
          </div>
        ) : status === 'fallback' ? (
          <div className="alert alert-success" role="status">
            <strong>Could not reach the form service.</strong> Copy this into an email, or open your
            mail client.
            <div style={{ marginTop: '1rem' }}>
              <pre className="summary-box">{summary}</pre>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
              <a className="btn btn-primary" href={mailto}>
                Open email draft
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="field-row field-row-2">
              <div className="field">
                <label htmlFor="contact-name">Name *</label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="contact-email">Email *</label>
                <input
                  id="contact-email"
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
              <label htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Order question, sizing help, custom idea…"
                required
              />
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {status === 'error' && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                Could not send the message. Try again in a moment, or email{' '}
                <a href={`mailto:${siteConfig.orderEmail}`}>{siteConfig.orderEmail}</a>.
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            <p className="hint">
              Prefer shopping first? <Link to="/shop">Browse the shop</Link> or{' '}
              <Link to="/custom">start a custom print</Link>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
