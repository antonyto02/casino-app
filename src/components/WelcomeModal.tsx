import { Coins, Sparkles } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';

interface WelcomeModalProps {
  open: boolean;
  username: string;
  chips: number;
  title?: string;
  onContinue: () => void;
}

const COIN_COUNT = 8;
const CONFETTI_COLORS = ['#d4af37', '#ffd76a', '#2dd47a', '#ef4444', '#f1eef9'];

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
}

function buildConfetti(count = 36): ConfettiPiece[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 150,
    duration: 700 + Math.random() * 500,
    drift: (Math.random() - 0.5) * 140,
  }));
}

export function WelcomeModal({
  open,
  username,
  chips,
  title = '¡Bienvenido',
  onContinue,
}: WelcomeModalProps) {
  const [displayChips, setDisplayChips] = useState(0);
  const [bursting, setBursting] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!open) {
      setDisplayChips(0);
      setBursting(false);
      setConfetti([]);
      return;
    }
    const duration = 900;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      setDisplayChips(Math.round(progress * chips));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, chips]);

  if (!open) return null;

  function handleContinue() {
    if (bursting) return;
    setConfetti(buildConfetti());
    setBursting(true);
    setTimeout(onContinue, 700);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal welcome-modal">
        <div className="welcome-coin-field">
          {Array.from({ length: COIN_COUNT }).map((_, i) => (
            <Coins key={i} size={22} className={`welcome-coin wc-${i}`} />
          ))}
          <Sparkles size={40} className="welcome-sparkle" />
        </div>

        <h3>
          {title}, {username}!
        </h3>
        <p className="welcome-sub">Se acreditaron tus fichas a la cuenta</p>

        <div className="welcome-chip-count">{displayChips.toLocaleString('es-MX')}</div>
        <p className="welcome-chip-label">fichas</p>

        <button className="primary" onClick={handleContinue} disabled={bursting}>
          Empezar a jugar
        </button>
      </div>

      {bursting && (
        <div className="confetti-field" aria-hidden="true">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="confetti-piece"
              style={
                {
                  left: `${piece.left}%`,
                  background: piece.color,
                  animationDelay: `${piece.delay}ms`,
                  animationDuration: `${piece.duration}ms`,
                  '--drift': `${piece.drift}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
