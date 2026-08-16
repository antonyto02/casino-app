import { Coins, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WelcomeModalProps {
  open: boolean;
  username: string;
  chips: number;
  title?: string;
  onContinue: () => void;
}

const COIN_COUNT = 8;

export function WelcomeModal({
  open,
  username,
  chips,
  title = '¡Bienvenido',
  onContinue,
}: WelcomeModalProps) {
  const [displayChips, setDisplayChips] = useState(0);

  useEffect(() => {
    if (!open) {
      setDisplayChips(0);
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

        <button className="primary" onClick={onContinue}>
          Empezar a jugar
        </button>
      </div>
    </div>
  );
}
