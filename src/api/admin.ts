import { api } from './client';

export interface LiveLogEntry {
  id: string;
  kind: 'permission' | 'consent';
  sessionId: string;
  createdAt: string;
  type?: string;
  status?: string;
  context?: string;
  category?: string;
  accepted?: boolean;
}

export function getLiveLog(limit = 30) {
  return api.get<LiveLogEntry[]>(`/admin/live?limit=${limit}`);
}
