import {
  Bell,
  Camera,
  CircleCheck,
  CircleX,
  Fingerprint,
  ListChecks,
  MapPin,
  Mic,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getAllCookies } from '../api/cookies';
import { getSessionId } from '../api/session';
import {
  ANALYTICS_COOKIE,
  MARKETING_COOKIE,
  NECESSARY_COOKIE,
} from '../context/ConsentContext';

interface PermissionEvent {
  id: number;
  type: string;
  status: string;
  context: string;
  createdAt: string;
}

interface Summary {
  sessionId: string;
  totalEvents: number;
  grantedTypes: string[];
  deniedTypes: string[];
  events: PermissionEvent[];
}

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

const COOKIE_LABELS: Record<string, string> = {
  [NECESSARY_COOKIE]:
    'Necesaria — identifica tu visita al laboratorio. No requiere consentimiento y siempre está presente.',
  [ANALYTICS_COOKIE]:
    'Analítica — simula el ID de rastreo que un sitio real usaría para medir tu comportamiento entre visitas.',
  [MARKETING_COOKIE]:
    'Marketing — simula la marca que activaría anuncios personalizados dirigidos a ti.',
};

const RISK_NOTES: Record<string, string> = {
  camera:
    'Una app con acceso a tu cámara podría, en un sitio malicioso, capturar tu imagen sin que lo notes si no verificas indicadores visibles.',
  microphone:
    'El micrófono activo podría usarse para escuchar conversaciones si no hay un indicador claro ni control del usuario.',
  geolocation:
    'La ubicación puede revelar tu domicilio, rutina o desplazamientos si se comparte con terceros no confiables.',
  notifications:
    'Las notificaciones concedidas se pueden usar para spam, phishing o para mantenerte enganchado a una app.',
};

export function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Summary>(`/events/summary/${getSessionId()}`)
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  const technicalInfo = {
    'User-Agent': navigator.userAgent,
    Idioma: navigator.language,
    Resolución: `${screen.width}x${screen.height}`,
    'Cookies habilitadas': navigator.cookieEnabled ? 'Sí' : 'No',
    'Claves en localStorage': Object.keys(localStorage).join(', ') || '—',
  };

  if (loading) return <p>Cargando tu huella digital de la sesión...</p>;

  const cookies = getAllCookies();
  const grantedCount = summary?.grantedTypes.length ?? 0;
  const deniedCount = summary?.deniedTypes.length ?? 0;
  const totalEvents = summary?.totalEvents ?? 0;

  return (
    <div className="dashboard page">
      <h2>
        <Fingerprint size={24} /> Tu huella digital en este laboratorio
      </h2>
      <p className="dashboard-intro">
        Durante esta experiencia autorizaste acceso a{' '}
        <strong>{grantedCount}</strong> recurso{grantedCount === 1 ? '' : 's'}{' '}
        de tu dispositivo.
      </p>

      <div className="stat-row">
        <div className="stat-card">
          <ListChecks size={20} />
          <span className="stat-value">{totalEvents}</span>
          <span className="stat-label">Eventos registrados</span>
        </div>
        <div className="stat-card stat-card-success">
          <CircleCheck size={20} />
          <span className="stat-value">{grantedCount}</span>
          <span className="stat-label">Permisos concedidos</span>
        </div>
        <div className="stat-card stat-card-danger">
          <CircleX size={20} />
          <span className="stat-value">{deniedCount}</span>
          <span className="stat-label">Permisos negados</span>
        </div>
      </div>

      <section>
        <h3>Qué permisos concediste voluntariamente</h3>
        {grantedCount === 0 ? (
          <p>Ninguno todavía — vuelve a la página principal y prueba los juegos.</p>
        ) : (
          <ul>
            {summary?.grantedTypes.map((type) => {
              const Icon = PERMISSION_ICONS[type] ?? CircleCheck;
              return (
                <li key={type} className="permission-item permission-item-granted">
                  <span className="permission-item-badge">
                    <Icon size={16} />
                    {PERMISSION_LABELS[type] ?? type}
                  </span>
                  <p>{RISK_NOTES[type]}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {summary && summary.deniedTypes.length > 0 && (
        <section>
          <h3>Permisos que negaste</h3>
          <ul>
            {summary.deniedTypes.map((type) => {
              const Icon = PERMISSION_ICONS[type] ?? CircleX;
              return (
                <li key={type} className="permission-item permission-item-denied">
                  <span className="permission-item-badge">
                    <Icon size={16} />
                    {PERMISSION_LABELS[type] ?? type}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <h3>Qué información técnica puede observar cualquier sitio WEB</h3>
        <p>Sin pedir ningún permiso especial, esto es visible para nosotros:</p>
        <table className="tech-table">
          <tbody>
            {Object.entries(technicalInfo).map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Cookies activas en este sitio ahora mismo</h3>
        <p>
          Esto no es una simulación: son las cookies reales que este
          laboratorio dejó en tu navegador (<code>document.cookie</code>).
        </p>
        {Object.keys(cookies).length === 0 ? (
          <p>
            Ninguna todavía — acepta o personaliza el aviso de cookies para
            verlas aparecer aquí.
          </p>
        ) : (
          <table className="tech-table">
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Valor</th>
                <th>Para qué sirve</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cookies).map(([name, value]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{value}</td>
                  <td>{COOKIE_LABELS[name] ?? 'Cookie no reconocida por este laboratorio.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3>Buenas prácticas como usuario y como desarrollador</h3>
        <ul>
          <li>Lee siempre para qué se pide un permiso antes de aceptar.</li>
          <li>
            Revoca permisos que ya no uses desde la configuración del
            navegador.
          </li>
          <li>
            Como desarrollador: pide permisos solo cuando son necesarios,
            explica el propósito y muestra siempre que un recurso está
            activo.
          </li>
          <li>
            Nunca almacenes ni transmitas video, audio o ubicación sin
            consentimiento explícito y un propósito claro.
          </li>
        </ul>
      </section>

      <section>
        <h3>Bitácora completa de esta sesión</h3>
        <table className="tech-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Permiso</th>
              <th>Estado</th>
              <th>Contexto</th>
            </tr>
          </thead>
          <tbody>
            {summary?.events.map((event) => (
              <tr key={event.id}>
                <td>{new Date(event.createdAt).toLocaleTimeString()}</td>
                <td>{PERMISSION_LABELS[event.type] ?? event.type}</td>
                <td>
                  <span className={`status-pill status-pill-${event.status}`}>
                    {event.status}
                  </span>
                </td>
                <td>{event.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
