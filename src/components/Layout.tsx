import { Coins, Dices, GraduationCap } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CookieBanner } from './CookieBanner';

export function Layout() {
  const { username, chips, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          <Dices size={22} /> Casino Zero Trust
        </Link>
        <nav>
          <Link to="/dashboard">Mi huella digital</Link>
          <Link to="/privacy">Aviso de privacidad</Link>
          {username ? (
            <>
              <span className="chips-balance">
                <Coins size={14} /> {chips ?? 0} fichas
              </span>
              <span className="username">Hola, {username}</span>
              <button onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Registrarme</Link>
            </>
          )}
        </nav>
      </header>
      <div className="marquee-lights" />

      <main>
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="marquee-lights" />
        <div className="app-footer-content">
          <span>
            <GraduationCap size={16} /> Proyecto Final Integrador — Laboratorio
            educativo de privacidad y ciberseguridad
          </span>
          <nav>
            <Link to="/privacy">Aviso de privacidad</Link>
            <Link to="/dashboard">Mi huella digital</Link>
          </nav>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
