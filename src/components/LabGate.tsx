import { GraduationCap, Lock, TriangleAlert } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';

const LAB_PASSWORD = 'utd2026';
const STORAGE_KEY = 'casino_lab_unlocked';

export function LabGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true',
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === LAB_PASSWORD) {
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
        <TriangleAlert size={32} className="lab-gate-warning-icon" />
        <h1>Laboratorio educativo, no un sitio real</h1>

        <div className="lab-gate-notice">
          <p>
            <GraduationCap size={18} /> Esto es un Proyecto Final Integrador
            académico (UTD), presentado como un laboratorio WEB de privacidad
            y ciberseguridad.
          </p>
          <ul>
            <li>No es un casino real: no se apuesta ni se gana dinero.</li>
            <li>
              No ingreses contraseñas, datos personales ni información real:
              usa siempre datos inventados.
            </li>
            <li>
              Todo lo que verás (permisos de cámara, micrófono, ubicación,
              notificaciones) es una simulación con fines de concientización,
              en un entorno controlado y con propósito educativo.
            </li>
            <li>
              El acceso aquí no otorga ningún permiso real de tu dispositivo:
              cada permiso se sigue pidiendo de forma explícita dentro del
              laboratorio.
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="lab-gate-form">
          <label>
            <Lock size={16} /> Contraseña de acceso al laboratorio
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
            Entiendo, entrar al laboratorio
          </button>
        </form>
      </div>
    </div>
  );
}
