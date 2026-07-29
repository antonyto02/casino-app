import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { api, clearToken, setToken } from '../api/client';

interface AuthResponse {
  accessToken: string;
  userId: number;
  username: string;
  chips: number;
}

interface AuthState {
  userId: number | null;
  username: string | null;
  chips: number | null;
}

interface AuthContextValue extends AuthState {
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  adjustChips: (delta: number) => Promise<number>;
}

const STORAGE_KEY = 'casino_user';
const EMPTY_STATE: AuthState = { userId: null, username: null, chips: null };

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_STATE;
  try {
    return { ...EMPTY_STATE, ...(JSON.parse(raw) as Partial<AuthState>) };
  } catch {
    return EMPTY_STATE;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readStoredUser);

  function persist(auth: AuthResponse) {
    setToken(auth.accessToken);
    const nextState = {
      userId: auth.userId,
      username: auth.username,
      chips: auth.chips,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    setState(nextState);
  }

  async function register(username: string, password: string) {
    const auth = await api.post<AuthResponse>('/auth/register', {
      username,
      password,
    });
    persist(auth);
  }

  async function login(username: string, password: string) {
    const auth = await api.post<AuthResponse>('/auth/login', {
      username,
      password,
    });
    persist(auth);
  }

  function logout() {
    clearToken();
    localStorage.removeItem(STORAGE_KEY);
    setState(EMPTY_STATE);
  }

  async function adjustChips(delta: number): Promise<number> {
    const result = await api.post<{ chips: number }>(
      '/users/me/chips/adjust',
      { delta },
    );
    setState((prev) => {
      const next = { ...prev, chips: result.chips };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return result.chips;
  }

  return (
    <AuthContext.Provider
      value={{ ...state, register, login, logout, adjustChips }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
