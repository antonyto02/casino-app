import { Camera, Cookie, MapPin, Mic, Bell, RefreshCw, Radio } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getLiveLog, type LiveLogEntry } from '../api/admin';

const POLL_MS = 3000;

const PERMISSION_LABELS: Record<string, string> = {
  camera: 'Cámara',
  microphone: 'Micrófono',
  geolocation: 'Ubicación',
  notifications: 'Notificaciones',
};

const PERMISSION_ICONS: Record<string, typeof Camera> = {
  camera: Camera,
  microphone: Mic,
  geolocation: MapPin,
  notifications: Bell,
};

const STATUS_LABELS: Record<string, string> = {
  requested: 'solicitado',
  granted: 'concedido',
  denied: 'negado',
};

const CATEGORY_LABELS: Record<string, string> = {
  necessary: 'Necesarias',
  analytics: 'Analíticas',
  marketing: 'Marketing',
};

function timeAgo(from: Date, now: Date) {
  const seconds = Math.max(0, Math.floor((now.getTime() - from.getTime()) / 1000));
  if (seconds < 2) return 'justo ahora';
  if (seconds < 60) return `hace ${seconds}s`;
  return `hace ${Math.floor(seconds / 60)} min`;
}

export function AdminLive() {
  const [entries, setEntries] = useState<LiveLogEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, forceTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    try {
      const data = await getLiveLog(40);
      setEntries(data);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError('Sin conexión con el servidor. Reintentando automáticamente…');
    }
  }

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, POLL_MS);
    const tick = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(tick);
    };
  }, []);

  const now = new Date();

  return (
    <div className="dashboard page">
      <h2>
        <Radio size={22} /> Panel en vivo — actividad del laboratorio
      </h2>
      <p className="dashboard-intro">
        Se actualiza sola cada {POLL_MS / 1000} segundos. Si la conexión falla, sigue
        reintentando sola; también puedes forzarlo con el botón.
      </p>

      <div className="stat-row">
        <div className="stat-card">
          <Radio size={20} />
          <span className="stat-value">
            {lastUpdated ? timeAgo(lastUpdated, now) : '—'}
          </span>
          <span className="stat-label">Última actualización</span>
        </div>
        <button className="secondary" onClick={refresh}>
          <RefreshCw size={16} /> Actualizar ahora
        </button>
      </div>

      {error && <p className="permission-denied">{error}</p>}

      <section>
        <h3>Bitácora en tiempo real</h3>
        {entries.length === 0 ? (
          <p>Todavía no hay actividad registrada en el laboratorio.</p>
        ) : (
          <table className="tech-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Sesión</th>
                <th>Evento</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                if (entry.kind === 'permission') {
                  const Icon = PERMISSION_ICONS[entry.type ?? ''] ?? Camera;
                  return (
                    <tr key={entry.id}>
                      <td>{new Date(entry.createdAt).toLocaleTimeString()}</td>
                      <td>{entry.sessionId.slice(0, 8)}</td>
                      <td>
                        <span className="permission-item-badge">
                          <Icon size={16} />
                          {PERMISSION_LABELS[entry.type ?? ''] ?? entry.type}
                        </span>{' '}
                        <span className="tech-table-context">{entry.context}</span>
                      </td>
                      <td>
                        <span
                          className={`status-pill status-pill-${entry.status ?? ''}`}
                        >
                          {STATUS_LABELS[entry.status ?? ''] ?? entry.status}
                        </span>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={entry.id}>
                    <td>{new Date(entry.createdAt).toLocaleTimeString()}</td>
                    <td>{entry.sessionId.slice(0, 8)}</td>
                    <td>
                      <span className="permission-item-badge">
                        <Cookie size={16} />
                        Cookie: {CATEGORY_LABELS[entry.category ?? ''] ?? entry.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-pill status-pill-${entry.accepted ? 'granted' : 'denied'}`}
                      >
                        {entry.accepted ? 'aceptada' : 'rechazada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
