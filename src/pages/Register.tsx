import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { WelcomeModal } from '../components/WelcomeModal';

export function Register() {
  const { register, username: authUsername, chips: authChips } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await register(username, password);
      setWelcomeOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarte');
    }
  }

  return (
    <AuthLayout title="Crear cuenta ficticia">
      <p className="auth-note">
        Esta cuenta es solo para el laboratorio: usa un usuario y contraseña
        inventados, nunca datos reales.
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={20}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary">
          Registrarme
        </button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>

      <WelcomeModal
        open={welcomeOpen}
        username={authUsername ?? username}
        chips={authChips ?? 0}
        title="¡Bienvenido"
        onContinue={() => navigate('/')}
      />
    </AuthLayout>
  );
}
