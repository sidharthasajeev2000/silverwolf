import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1>404 — not on the shelf</h1>
          <p>That route does not exist in this workshop build.</p>
        </header>
        <Link to="/" className="btn btn-primary">
          Back home
        </Link>
      </div>
    </div>
  );
}
