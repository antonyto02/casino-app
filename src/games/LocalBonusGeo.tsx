import { Diamond, ExternalLink, MapPin } from 'lucide-react';
import { useState } from 'react';
import { PermissionModal } from '../components/PermissionModal';
import { usePermissionFlow } from '../hooks/usePermissionFlow';

export function LocalBonusGeo() {
  const flow = usePermissionFlow('geolocation', 'local-bonus');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );

  async function acquireLocation() {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
    );
    setCoords({
      lat: Number(position.coords.latitude.toFixed(3)),
      lon: Number(position.coords.longitude.toFixed(3)),
    });
  }

  return (
    <div className="game-card">
      <Diamond size={90} className="suit-watermark" />
      <h3>
        <span className="icon-badge">
          <MapPin size={18} />
        </span>
        Bono local
      </h3>

      <div className="radar">
        <span className="radar-ring" />
        <span className="radar-ring" style={{ animationDelay: '0.7s' }} />
        <span className="radar-ring" style={{ animationDelay: '1.4s' }} />
        <span className="radar-pin">
          <MapPin size={22} />
        </span>
      </div>

      <p>Desbloquea un bono exclusivo para jugadores de tu ciudad.</p>

      {flow.state === 'idle' && (
        <button className="secondary" onClick={flow.openModal}>
          Reclamar bono local
        </button>
      )}

      <PermissionModal
        open={flow.state === 'confirming'}
        title="Bono exclusivo por ubicación"
        pretext="Comparte tu ubicación para desbloquear un bono exclusivo de tu ciudad."
        realPurpose="Solo mostramos tus coordenadas redondeadas en pantalla, en tu navegador. Nada se envía al servidor ni se guarda."
        riskNote="La geolocalización precisa puede revelar tu domicilio, rutina diaria o ubicación en tiempo real a quien la reciba."
        onAllow={() => flow.grant(acquireLocation)}
        onDeny={flow.deny}
      />

      {flow.state === 'granted' && coords && (
        <div className="permission-active">
          <span className="live-indicator">● Ubicación obtenida</span>
          <p>
            Coordenadas aproximadas:{' '}
            <a
              className="geo-map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {coords.lat}, {coords.lon} <ExternalLink size={14} />
            </a>
          </p>
          <p>Esto es todo lo que un sitio puede ver con este permiso.</p>
        </div>
      )}

      {flow.state === 'denied' && (
        <p className="permission-denied">
          Permiso denegado. No hay bono local disponible.
        </p>
      )}
    </div>
  );
}
