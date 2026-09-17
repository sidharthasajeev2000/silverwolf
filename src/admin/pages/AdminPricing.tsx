import { useMemo, useState, type FormEvent } from 'react';
import { getLivePricing, resetPricing, savePricing } from '../../utils/store';

export function AdminPricing() {
  const live = useMemo(() => getLivePricing(), []);
  const [filamentPerGram, setFilamentPerGram] = useState(live.filamentPerGram);
  const [markup, setMarkup] = useState(live.markup);
  const [minimum, setMinimum] = useState(live.minimum);
  const [saved, setSaved] = useState(false);

  function onSave(e: FormEvent) {
    e.preventDefault();
    savePricing({
      filamentPerGram: Number(filamentPerGram) || 0,
      markup: Number(markup) || 0,
      minimum: Number(minimum) || 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function onReset() {
    if (!confirm('Reset pricing overlay to seed values?')) return;
    resetPricing();
    const seed = getLivePricing();
    setFilamentPerGram(seed.filamentPerGram);
    setMarkup(seed.markup);
    setMinimum(seed.minimum);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Pricing</h1>
        <p>
          Custom-print quote rates. Formula: max(minimum, grams × filament ₹/g × markup). Changes
          apply via localStorage overlay.
        </p>
      </header>

      <form className="admin-panel" onSubmit={onSave} style={{ maxWidth: 480 }}>
        <div className="field">
          <label htmlFor="filament">Filament ₹/g</label>
          <input
            id="filament"
            type="number"
            min={0}
            step={0.001}
            value={filamentPerGram}
            onChange={(e) => setFilamentPerGram(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="markup">Markup</label>
          <input
            id="markup"
            type="number"
            min={0}
            step={0.1}
            value={markup}
            onChange={(e) => setMarkup(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="minimum">Minimum (₹)</label>
          <input
            id="minimum"
            type="number"
            min={0}
            step={0.01}
            value={minimum}
            onChange={(e) => setMinimum(Number(e.target.value))}
          />
        </div>
        {saved ? (
          <p className="alert alert-success" role="status">
            Saved.
          </p>
        ) : null}
        <div className="admin-header-actions">
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Reset to seed
          </button>
          <button type="submit" className="btn btn-primary">
            Save pricing
          </button>
        </div>
      </form>
    </div>
  );
}
