import { Lock, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';

const ADMIN_PASSWORD = 'utd2026-admin';
const STORAGE_KEY = 'casino_admin_unlocked';

export function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true',
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setUnlocked(true);
    } else {
      setError(true);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="lab-gate">
      <div className="lab-gate-card">
        <ShieldCheck size={32} className="lab-gate-warning-icon" />
        <h1>Panel del profesor</h1>

        <div className="lab-gate-notice">
          <p>
            Vista de solo lectura para observar, en vivo, los permisos y
            cookies que se van generando durante la demostración en
            cualquier dispositivo conectado al laboratorio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="lab-gate-form">
          <label>
            <Lock size={16} /> Contraseña de administrador
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
            />
          </label>
          {error && (
            <p className="form-error">Contraseña incorrecta. Intenta de nuevo.</p>
          )}
          <button type="submit" className="primary">
            Entrar al panel
          </button>
        </form>
      </div>
    </div>
  );
}
