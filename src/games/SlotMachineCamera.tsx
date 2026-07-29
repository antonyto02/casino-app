import {
  Bell,
  Cherry,
  Citrus,
  Coins,
  Gem,
  Spade,
  Star,
  Trophy,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PermissionModal } from '../components/PermissionModal';
import { usePermissionFlow } from '../hooks/usePermissionFlow';
import { useAuth } from '../context/AuthContext';

const SYMBOLS = [Cherry, Citrus, Gem, Star, Bell, Trophy];
const SPIN_COST = 10;
const WIN_REWARD = 50;

function spinSymbols() {
  return Array.from(
    { length: 3 },
    () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  );
}

export function SlotMachineCamera() {
  const flow = usePermissionFlow('camera', 'slot-machine');
  const { username, chips, adjustChips } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [reels, setReels] = useState(SYMBOLS.slice(0, 3));
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const canAfford = username ? (chips ?? 0) >= SPIN_COST : true;

  async function spin() {
    if (!canAfford) {
      setResult('No te alcanzan las fichas para girar.');
      return;
    }

    setSpinning(true);
    const next = spinSymbols();
    setReels(next);

    if (username) {
      const isWin = next.every((SymbolIcon) => SymbolIcon === next[0]);
      const net = isWin ? WIN_REWARD - SPIN_COST : -SPIN_COST;
      await adjustChips(net);
      setResult(
        isWin
          ? `¡Tres iguales! Ganaste ${WIN_REWARD} fichas.`
          : `Perdiste ${SPIN_COST} fichas.`,
      );
    } else {
      setResult(null);
    }

    setTimeout(() => setSpinning(false), 400);
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    flow.closeModal();
  }

  useEffect(() => stopCamera, []);

  async function acquireCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }

  return (
    <div className="game-card">
      <Spade size={90} className="suit-watermark" />
      <h3>
        <span className="icon-badge">
          <Coins size={18} />
        </span>
        Tragamonedas
      </h3>

      <div className="slot-cabinet">
        <div className="marquee-lights" />
        <div className="slot-window">
          <div className={`reels${spinning ? ' spinning' : ''}`}>
            {reels.map((SymbolIcon, index) => (
              <span className="reel-slot" key={index}>
                <SymbolIcon size={30} />
              </span>
            ))}
          </div>
          <button
            className="primary"
            onClick={spin}
            disabled={spinning || !canAfford}
          >
            Girar {username ? `(${SPIN_COST} fichas)` : ''}
          </button>
        </div>
        <button
          className="slot-lever"
          aria-label="Palanca del tragamonedas"
          onClick={spin}
          disabled={spinning || !canAfford}
        >
          <span className="slot-lever-knob" />
        </button>
      </div>

      {username ? (
        result && <p className="slot-result">{result}</p>
      ) : (
        <p className="auth-note">
          Inicia sesión para apostar fichas ficticias del casino.
        </p>
      )}

      {flow.state === 'idle' && (
        <button className="secondary" onClick={flow.openModal}>
          Verificar identidad para jugar con bono
        </button>
      )}

      <PermissionModal
        open={flow.state === 'confirming'}
        title="Verificación facial de identidad"
        pretext="Activa tu cámara para verificar tu identidad y desbloquear el bono de bienvenida."
        realPurpose="Este 'requisito' es un pretexto típico en sitios reales para pedir acceso a tu cámara. Aquí solo mostramos una vista previa en vivo: nunca grabamos, guardamos ni enviamos imagen alguna al servidor."
        riskNote="En un sitio real, aceptar sin leer puede exponer tu imagen a terceros, permitir huella biométrica o quedar activa sin que lo notes."
        onAllow={() => flow.grant(acquireCamera)}
        onDeny={flow.deny}
      />

      {flow.state === 'granted' && (
        <div className="permission-active">
          <span className="live-indicator">● Cámara activa</span>
          <video ref={videoRef} autoPlay muted playsInline />
          <p>Nada de este video se graba ni se envía. Solo tú lo ves.</p>
          <button onClick={stopCamera}>Detener cámara y salir</button>
        </div>
      )}

      {flow.state === 'denied' && (
        <p className="permission-denied">
          Permiso denegado. Puedes seguir jugando sin el bono.
        </p>
      )}
    </div>
  );
}
