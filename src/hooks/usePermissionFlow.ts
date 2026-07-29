import { useState } from 'react';
import { logPermissionEvent, type PermissionType } from '../api/events';

export type FlowState = 'idle' | 'confirming' | 'granted' | 'denied';

export function usePermissionFlow(type: PermissionType, context: string) {
  const [state, setState] = useState<FlowState>('idle');

  function openModal() {
    setState('confirming');
    void logPermissionEvent(type, 'requested', context);
  }

  function closeModal() {
    setState('idle');
  }

  async function deny() {
    setState('denied');
    await logPermissionEvent(type, 'denied', context);
  }

  async function grant(acquire: () => Promise<void>) {
    try {
      await acquire();
      setState('granted');
      await logPermissionEvent(type, 'granted', context);
    } catch {
      setState('denied');
      await logPermissionEvent(type, 'denied', context);
    }
  }

  return { state, openModal, closeModal, deny, grant };
}
