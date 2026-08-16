import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { WelcomeModal } from '../components/WelcomeModal';

export function Login() {
  const { login, username: authUsername, chips: authChips } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      setWelcomeOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  }

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={handleSubmit}>
        <label>
          Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary">
          Entrar
        </button>
      </form>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>

      <WelcomeModal
        open={welcomeOpen}
        username={authUsername ?? username}
        chips={authChips ?? 0}
        title="De vuelta"
        onContinue={() => navigate('/')}
      />
    </AuthLayout>
  );
}
