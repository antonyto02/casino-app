import { Disc3, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PermissionModal } from '../components/PermissionModal';
import { usePermissionFlow } from '../hooks/usePermissionFlow';

export function RouletteVoice() {
  const flow = usePermissionFlow('microphone', 'roulette-voice-bet');
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  function stopMic() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    setLevel(0);
    flow.closeModal();
  }

  useEffect(() => stopMic, []);

  async function acquireMic() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    streamRef.current = stream;

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
      setLevel(Math.min(100, Math.round((avg / 255) * 100)));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }

  return (
    <div className="game-card">
      <Heart size={90} className="suit-watermark" />
      <h3>
        <span className="icon-badge">
          <Disc3 size={18} />
        </span>
        Ruleta por voz
      </h3>

      <div className="roulette-wheel-wrap">
        <div
          className={`roulette-wheel${flow.state === 'granted' ? ' roulette-wheel-active' : ''}`}
          style={
            flow.state === 'granted'
              ? { animationDuration: `${Math.max(0.6, 3 - level / 40)}s` }
              : undefined
          }
        >
          <div className="roulette-wheel-hub" />
        </div>
        <div className="roulette-ball-orbit">
          <span className="roulette-ball" />
        </div>
      </div>

      <p>Apuesta diciendo un número en voz alta.</p>

      {flow.state === 'idle' && (
        <button className="secondary" onClick={flow.openModal}>
          Apostar con comando de voz
        </button>
      )}

      <PermissionModal
        open={flow.state === 'confirming'}
        title="Comando de voz para apostar"
        pretext="Activa tu micrófono para decir tu apuesta en voz alta."
        realPurpose="Solo medimos el volumen de tu voz en vivo para mostrar el nivel; nunca grabamos, transcribimos ni enviamos audio al servidor."
        riskNote="Un micrófono activo sin indicador visible podría escuchar conversaciones privadas sin que el usuario lo note."
        onAllow={() => flow.grant(acquireMic)}
        onDeny={flow.deny}
      />

      {flow.state === 'granted' && (
        <div className="permission-active">
          <span className="live-indicator">● Micrófono activo</span>
          <div className="level-meter">
            <div className="level-fill" style={{ width: `${level}%` }} />
          </div>
          <p>Nada de tu audio se graba ni se envía.</p>
          <button onClick={stopMic}>Detener micrófono y salir</button>
        </div>
      )}

      {flow.state === 'denied' && (
        <p className="permission-denied">
          Permiso denegado. Puedes apostar con los botones normales.
        </p>
      )}
    </div>
  );
}
