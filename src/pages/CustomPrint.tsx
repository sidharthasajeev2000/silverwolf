import type { DragEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { OrderForm } from '../components/OrderForm';
import { getLivePricing } from '../utils/store';
import { parseStlFile, type StlParseOutcome } from '../utils/stlParser';
import { estimateQuote, formatUsd } from '../utils/quote';
import { buildCustomOrderSummary } from '../utils/orderSubmit';

export function CustomPrint() {
  const pricing = getLivePricing();
  const [file, setFile] = useState<File | null>(null);
  const [parse, setParse] = useState<StlParseOutcome | null>(null);
  const [parsing, setParsing] = useState(false);
  const [fileLink, setFileLink] = useState('');
  const [material, setMaterial] = useState<string>(pricing.materials[0]);
  const [color, setColor] = useState<string>(pricing.colors[0]);
  const [infill, setInfill] = useState<string>('20%');
  const [quantity, setQuantity] = useState(1);
  const [drag, setDrag] = useState(false);

  const quote = useMemo(() => {
    if (!parse || !parse.ok) return null;
    return estimateQuote({
      volumeCm3: parse.volumeCm3,
      material,
      infill,
      quantity,
    });
  }, [parse, material, infill, quantity]);

  const onFile = useCallback(async (f: File | null) => {
    setFile(f);
    setParse(null);
    if (!f) return;
    setParsing(true);
    try {
      const result = await parseStlFile(f);
      setParse(result);
    } finally {
      setParsing(false);
    }
  }, []);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void onFile(f);
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1>Custom print</h1>
          <p>
            Upload a binary STL for an instant volume estimate and rough quote. If parsing fails
            (ASCII STL, etc.), paste a file link and notes — we still take the request.
          </p>
        </header>

        <div className="custom-layout">
          <div>
            <div
              className={`dropzone ${drag ? 'active' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <label className="dropzone-label">
                <input
                  type="file"
                  accept=".stl,model/stl,application/sla"
                  onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
                />
                <strong>{file ? file.name : 'Drop STL here or click to browse'}</strong>
                <p>Binary STL preferred for auto-quote. Max practical size ~50 MB in-browser.</p>
              </label>
            </div>

            {parsing && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                Parsing STL…
              </p>
            )}

            {parse && !parse.ok && (
              <div className="alert alert-warn" style={{ marginTop: '1rem' }} role="status">
                {parse.message}
              </div>
            )}

            {parse?.ok && (
              <div className="alert alert-success" style={{ marginTop: '1rem' }} role="status">
                Parsed {parse.triangleCount.toLocaleString()} triangles — volume ≈{' '}
                {parse.volumeCm3.toFixed(2)} cm³ (solid).
              </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <div className="field">
                <label htmlFor="file-link">File link (Drive / Dropbox / WeTransfer)</label>
                <input
                  id="file-link"
                  type="url"
                  placeholder="https://…"
                  value={fileLink}
                  onChange={(e) => setFileLink(e.target.value)}
                />
                <p className="hint">Required if you did not upload a parseable binary STL.</p>
              </div>

              <div className="field-row field-row-3">
                <div className="field">
                  <label htmlFor="mat">Material</label>
                  <select id="mat" value={material} onChange={(e) => setMaterial(e.target.value)}>
                    {pricing.materials.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="color">Color</label>
                  <select id="color" value={color} onChange={(e) => setColor(e.target.value)}>
                    {pricing.colors.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="infill">Infill</label>
                  <select id="infill" value={infill} onChange={(e) => setInfill(e.target.value)}>
                    {pricing.infills.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field" style={{ maxWidth: 140 }}>
                <label htmlFor="cqty">Quantity</label>
                <input
                  id="cqty"
                  type="number"
                  min={1}
                  max={50}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
            </div>

            <hr className="metal-divider" />

            <h2 className="section-title" style={{ fontSize: '1.2rem' }}>
              Request this custom print
            </h2>
            <OrderForm
              submitLabel="Submit custom order request"
              buildPayload={({ name, email, shippingCountry, notes }) => {
                const parseNote =
                  parse && !parse.ok ? parse.message : file && !parse ? 'File attached but not parsed' : undefined;
                const summary = buildCustomOrderSummary({
                  fileName: file?.name,
                  fileLink: fileLink || undefined,
                  material,
                  color,
                  infill,
                  quantity,
                  volumeCm3: quote?.volumeCm3,
                  estimatedGrams: quote?.estimatedGrams,
                  quotedTotal: quote?.totalPrice,
                  parseNote,
                  name,
                  email,
                  shippingCountry,
                  notes,
                });
                return {
                  type: 'custom-print',
                  name,
                  email,
                  shippingCountry,
                  details: notes,
                  summary,
                  fileName: file?.name,
                  fileLink,
                  material,
                  color,
                  infill,
                  quantity,
                  volumeCm3: quote?.volumeCm3,
                  estimatedGrams: quote?.estimatedGrams,
                  quotedTotal: quote?.totalPrice,
                  parseOk: parse?.ok ?? false,
                };
              }}
            />
          </div>

          <aside className="quote-box" aria-live="polite">
            <h2>Rough quote</h2>
            {quote ? (
              <>
                <div className="quote-stats">
                  <div className="quote-stat">
                    <span>Volume (solid)</span>
                    <span>{quote.volumeCm3} cm³</span>
                  </div>
                  <div className="quote-stat">
                    <span>Est. mass</span>
                    <span>{quote.estimatedGrams} g</span>
                  </div>
                  <div className="quote-stat">
                    <span>Material / infill</span>
                    <span>
                      {material} · {infill}
                    </span>
                  </div>
                  <div className="quote-stat">
                    <span>Unit (approx.)</span>
                    <span>{formatUsd(quote.unitPrice)}</span>
                  </div>
                </div>
                <div className="quote-total">{formatUsd(quote.totalPrice)}</div>
                <p className="hint">
                  Approx. for {quantity}× — final invoice may change for supports, orientation, or
                  finishing. Rates editable in admin Pricing (or <code>src/data/pricing.ts</code>).
                </p>
              </>
            ) : (
              <p className="hint" style={{ margin: 0 }}>
                Upload a binary STL to see volume, grams, and a rough price. You can still submit
                with a file link if parsing is unavailable.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
