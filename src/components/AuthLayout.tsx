import { Dices, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

export function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="page auth-page">
      <div className="auth-split">
        <aside className="auth-side">
          <span className="icon-badge auth-side-badge">
            <Dices size={22} />
          </span>
          <h2>Casino Zero Trust</h2>
          <p>
            Cuentas 100% ficticias para explorar el laboratorio. Nunca uses
            contraseñas reales aquí.
          </p>
          <ul className="auth-side-list">
            <li>
              <ShieldCheck size={16} /> Contraseñas guardadas con hash, nunca
              en texto plano
            </li>
            <li>
              <ShieldCheck size={16} /> Sin datos personales reales
            </li>
            <li>
              <ShieldCheck size={16} /> Fines exclusivamente educativos
            </li>
          </ul>
        </aside>

        <div className="auth-form">
          <h2>{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
