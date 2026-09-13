const AUTH_KEY = 'silverwolf.admin.authed';

function expectedPin(): string {
  const fromEnv = import.meta.env.VITE_ADMIN_PIN;
  return (typeof fromEnv === 'string' && fromEnv.trim()) || 'silverwolf';
}

export function login(pin: string): boolean {
  if (pin === expectedPin()) {
    sessionStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}
