import { Bell, Club } from 'lucide-react';
import { useState } from 'react';
import { PermissionModal } from '../components/PermissionModal';
import { usePermissionFlow } from '../hooks/usePermissionFlow';

export function PrizeAlertsNotifications() {
  const flow = usePermissionFlow('notifications', 'prize-alerts');
  const [demoSent, setDemoSent] = useState(false);

  async function acquireNotifications() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permiso de notificaciones no concedido');
    }
  }

  function sendDemoNotification() {
    new Notification('Casino Zero Trust (demo)', {
      body: 'Esta es una notificación local de ejemplo, generada por tu propio navegador.',
    });
    setDemoSent(true);
  }

  return (
    <div className="game-card">
      <Club size={90} className="suit-watermark" />
      <h3>
        <span className="icon-badge">
          <Bell size={18} />
        </span>
        Alertas de premio
      </h3>

      <div className="bell-medal">
        <span className="bell-ring" />
        <Bell size={26} />
      </div>

      <p>Recibe una alerta cuando haya un premio disponible para ti.</p>

      {flow.state === 'idle' && (
        <button className="secondary" onClick={flow.openModal}>
          Activar alertas de premio
        </button>
      )}

      <PermissionModal
        open={flow.state === 'confirming'}
        title="Alertas de premios"
        pretext="Activa las notificaciones para enterarte al instante cuando ganes un premio."
        realPurpose="Solo dispararemos una notificación de demostración generada localmente en tu navegador, nunca desde un servidor externo."
        riskNote="Las notificaciones push reales pueden usarse para spam, phishing o mantener tu atención de forma manipuladora una vez concedidas."
        onAllow={() => flow.grant(acquireNotifications)}
        onDeny={flow.deny}
      />

      {flow.state === 'granted' && (
        <div className="permission-active">
          <span className="live-indicator">● Notificaciones activas</span>
          <button onClick={sendDemoNotification} disabled={demoSent}>
            {demoSent ? 'Notificación de ejemplo enviada' : 'Enviar ejemplo'}
          </button>
        </div>
      )}

      {flow.state === 'denied' && (
        <p className="permission-denied">
          Permiso denegado. No recibirás alertas de premio.
        </p>
      )}
    </div>
  );
}
