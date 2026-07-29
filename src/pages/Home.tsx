import {
  Bell as BellIcon,
  Camera,
  ChevronDown,
  Dices,
  Eye,
  Fingerprint,
  LogOut,
  MapPin,
  Mic,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SlotMachineCamera } from '../games/SlotMachineCamera';
import { RouletteVoice } from '../games/RouletteVoice';
import { LocalBonusGeo } from '../games/LocalBonusGeo';
import { PrizeAlertsNotifications } from '../games/PrizeAlertsNotifications';

const STATS = [
  { icon: Camera, label: '4 juegos temáticos' },
  { icon: Mic, label: '4 permisos del navegador' },
  { icon: Fingerprint, label: '100% educativo' },
];

const FEATURED_POINTS = [
  { icon: ShieldCheck, text: 'Nunca se graba ni se sube nada al servidor' },
  { icon: Eye, text: 'Verás siempre un indicador cuando la cámara esté activa' },
  { icon: LogOut, text: 'Puedes cortar el acceso cuando quieras, sin perder tu ficha' },
];

export function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <span className="chip chip-red" style={{ top: '12%', left: '8%', width: 70, height: 70 }} />
        <span className="chip chip-green" style={{ top: '68%', left: '4%', width: 46, height: 46, animationDelay: '1.4s' }} />
        <span className="chip chip-gold" style={{ top: '18%', right: '10%', width: 56, height: 56, animationDelay: '0.7s' }} />
        <span className="chip chip-red" style={{ top: '66%', right: '6%', width: 40, height: 40, animationDelay: '2.1s' }} />

        <div className="container hero-inner">
          <span className="hero-kicker">Casino ficticio · Laboratorio de privacidad</span>
          <h1>
            <Dices size={48} /> Casino Zero Trust
          </h1>
          <p>
            ¿Qué puede saber un sitio WEB sobre ti? Juega, concede o niega
            permisos, y descubre al final tu huella digital de la sesión.
          </p>

          <div className="hero-cta-row">
            <Link to="/dashboard" className="button primary">
              Ver mi huella digital
            </Link>
            <a href="#juegos" className="hero-secondary-link">
              Explorar los juegos <ChevronDown size={16} />
            </a>
          </div>

          <div className="hero-stats">
            {STATS.map(({ icon: Icon, label }) => (
              <span className="hero-stat" key={label}>
                <Icon size={16} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured game */}
      <section className="featured-band" id="juegos">
        <div className="container featured-inner">
          <div className="featured-visual">
            <SlotMachineCamera />
          </div>
          <div className="featured-copy">
            <span className="section-kicker">Juego insignia</span>
            <h2>La "verificación" que nadie cuestiona</h2>
            <p>
              Como en cualquier casino que se respeta, te pedimos la cámara
              antes de dejarte jugar por el bono grande. Es el mismo pretexto
              que usan sitios reales — aquí es donde se rompe la confianza
              ciega y empieza la lección.
            </p>
            <ul className="featured-points">
              {FEATURED_POINTS.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Icon size={18} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Secondary games */}
      <section className="more-games-band">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Más mesas, más permisos</span>
            <h2>Elige tu próximo riesgo</h2>
            <p>
              Cada mesa pide un permiso distinto del navegador, siempre con
              el mismo patrón: pretexto de casino, consentimiento explícito
              y bitácora del resultado.
            </p>
          </div>
          <div className="games-grid">
            <RouletteVoice />
            <LocalBonusGeo />
            <PrizeAlertsNotifications />
          </div>
        </div>
      </section>

      {/* Permissions trust bar */}
      <section className="permissions-band">
        <div className="container permissions-band-inner">
          <p className="permissions-band-title">
            Este laboratorio pide, siempre de forma explícita:
          </p>
          <div className="permissions-band-items">
            <span>
              <Camera size={22} /> Cámara
            </span>
            <span>
              <Mic size={22} /> Micrófono
            </span>
            <span>
              <MapPin size={22} /> Ubicación
            </span>
            <span>
              <BellIcon size={22} /> Notificaciones
            </span>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="cta-band">
        <div className="container cta-inner">
          <Fingerprint size={40} />
          <h2>¿Listo para ver tu huella digital?</h2>
          <p>
            Cada permiso que concediste o negaste quedó registrado. Míralo
            traducido a riesgos reales y buenas prácticas.
          </p>
          <Link to="/dashboard" className="button primary">
            Ver mi huella digital
          </Link>
        </div>
      </section>
    </div>
  );
}
