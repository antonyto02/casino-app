import { Cookie } from 'lucide-react';
import { useState } from 'react';
import { useConsent } from '../context/ConsentContext';

export function CookieBanner() {
  const { bannerVisible, acceptAll, savePreferences } = useConsent();
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!bannerVisible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consentimiento de cookies">
      <p className="cookie-banner-text">
        <Cookie size={20} />
        <span>
          Usamos cookies y almacenamiento local para simular la experiencia
          de este laboratorio educativo de privacidad. Las cookies{' '}
          <strong>necesarias</strong> siempre están activas; tú decides el
          resto.
        </span>
      </p>

      {expanded && (
        <div className="cookie-options">
          <label>
            <input type="checkbox" checked disabled /> Necesarias (siempre
            activas)
          </label>
          <label>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />{' '}
            Analíticas (medir uso del laboratorio)
          </label>
          <label>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />{' '}
            Marketing (simular ofertas del casino)
          </label>
        </div>
      )}

      <div className="cookie-actions">
        {!expanded && (
          <button onClick={() => setExpanded(true)}>Personalizar</button>
        )}
        {expanded && (
          <button onClick={() => savePreferences({ analytics, marketing })}>
            Guardar preferencias
          </button>
        )}
        <button className="primary" onClick={() => acceptAll()}>
          Aceptar todo
        </button>
      </div>
    </div>
  );
}
