import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isAdminAuthed, login } from '../auth';
import { asset } from '../../utils/asset';
import '../admin.css';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/admin';
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (isAdminAuthed()) {
    return <Navigate to="/admin" replace />;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (login(pin.trim())) {
      navigate(from, { replace: true });
    } else {
      setError('Incorrect PIN');
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <div className="admin-login-brand">
          <img src={asset("logo.png")} alt="" width={48} height={48} />
          <h1>Silverwolf Admin</h1>
          <p>Enter the admin PIN to manage orders &amp; catalog.</p>
        </div>
        <div className="field">
          <label htmlFor="admin-pin">PIN</label>
          <input
            id="admin-pin"
            type="password"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            autoFocus
          />
        </div>
        {error ? (
          <p className="alert alert-warn" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Log in
        </button>
      </form>
    </div>
  );
}
