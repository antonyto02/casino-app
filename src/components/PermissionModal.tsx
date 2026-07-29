import type { ReactNode } from 'react';

interface PermissionModalProps {
  open: boolean;
  title: string;
  pretext: string;
  realPurpose: string;
  riskNote: string;
  onAllow: () => void;
  onDeny: () => void;
  children?: ReactNode;
}

export function PermissionModal({
  open,
  title,
  pretext,
  realPurpose,
  riskNote,
  onAllow,
  onDeny,
  children,
}: PermissionModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>
        <p className="modal-pretext">"{pretext}"</p>

        <div className="modal-truth">
          <strong>Qué es esto en realidad:</strong>
          <p>{realPurpose}</p>
        </div>

        <div className="modal-risk">
          <strong>Por qué importa:</strong>
          <p>{riskNote}</p>
        </div>

        {children}

        <div className="modal-actions">
          <button onClick={onDeny}>No, gracias</button>
          <button className="primary" onClick={onAllow}>
            Permitir
          </button>
        </div>
      </div>
    </div>
  );
}
