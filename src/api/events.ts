import { api } from './client';
import { getSessionId } from './session';

export type PermissionType =
  | 'camera'
  | 'microphone'
  | 'geolocation'
  | 'notifications';

export type PermissionStatus = 'requested' | 'granted' | 'denied';

export function logPermissionEvent(
  type: PermissionType,
  status: PermissionStatus,
  context: string,
) {
  return api.post('/events', {
    sessionId: getSessionId(),
    type,
    status,
    context,
  });
}
